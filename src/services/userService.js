const ApiError = require('../utils/ApiError');
const prisma = require('../utils/prisma');
const { getPaginationParams, buildPaginationMeta } = require('../utils/pagination');

const userSelect = {
  id: true,
  username: true,
  name: true,
  bio: true,
  avatarUrl: true,
  createdAt: true,
};

const getById = async (userId, currentUserId = null) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      ...userSelect,
      email: currentUserId === userId ? true : false,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (currentUserId !== userId) {
    delete user.email;
  }

  const followersCount = await prisma.follower.count({
    where: { followingId: userId },
  });
  const followingCount = await prisma.follower.count({
    where: { followerId: userId },
  });

  let isFollowing = false;
  if (currentUserId && currentUserId !== userId) {
    const follow = await prisma.follower.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId,
        },
      },
    });
    isFollowing = !!follow;
  }

  return {
    ...user,
    followersCount,
    followingCount,
    isFollowing,
  };
};

const updateProfile = async (userId, data) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
    },
    select: userSelect,
  });
  return user;
};

const follow = async (followerId, followingId) => {
  if (followerId === followingId) {
    throw new ApiError(400, 'Cannot follow yourself');
  }

  const target = await prisma.user.findUnique({
    where: { id: followingId },
  });

  if (!target) {
    throw new ApiError(404, 'User not found');
  }

  await prisma.follower.create({
    data: {
      followerId,
      followingId,
    },
  });

  return { message: 'Followed successfully' };
};

const unfollow = async (followerId, followingId) => {
  await prisma.follower.deleteMany({
    where: {
      followerId,
      followingId,
    },
  });
  return { message: 'Unfollowed successfully' };
};

const getFollowers = async (userId, query) => {
  const { skip, take, page, limit } = getPaginationParams(query);

  const [followers, total] = await Promise.all([
    prisma.follower.findMany({
      where: { followingId: userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        follower: { select: userSelect },
      },
    }),
    prisma.follower.count({
      where: { followingId: userId },
    }),
  ]);

  return {
    data: followers.map((f) => f.follower),
    pagination: buildPaginationMeta(total, page, limit),
  };
};

const getFollowing = async (userId, query) => {
  const { skip, take, page, limit } = getPaginationParams(query);

  const [following, total] = await Promise.all([
    prisma.follower.findMany({
      where: { followerId: userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        following: { select: userSelect },
      },
    }),
    prisma.follower.count({
      where: { followerId: userId },
    }),
  ]);

  return {
    data: following.map((f) => f.following),
    pagination: buildPaginationMeta(total, page, limit),
  };
};

module.exports = {
  getById,
  updateProfile,
  follow,
  unfollow,
  getFollowers,
  getFollowing,
};
