const ApiError = require('../utils/ApiError');
const prisma = require('../utils/prisma');
const { getPaginationParams, buildPaginationMeta } = require('../utils/pagination');

const postInclude = {
  author: {
    select: {
      id: true,
      username: true,
      name: true,
      avatarUrl: true,
    },
  },
  reactions: {
    select: {
      id: true,
      type: true,
      userId: true,
    },
  },
  _count: {
    select: { comments: true },
  },
};

const create = async (authorId, { content, imageUrl }) => {
  const post = await prisma.post.create({
    data: {
      content,
      imageUrl,
      authorId,
    },
    include: postInclude,
  });
  return post;
};

const getById = async (postId, currentUserId = null) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: postInclude,
  });

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  return formatPost(post, currentUserId);
};

const update = async (postId, userId, data) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  if (post.authorId !== userId) {
    throw new ApiError(403, 'Not authorized to edit this post');
  }

  return prisma.post.update({
    where: { id: postId },
    data: {
      ...(data.content !== undefined && { content: data.content }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
    },
    include: postInclude,
  });
};

const remove = async (postId, userId) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  if (post.authorId !== userId) {
    throw new ApiError(403, 'Not authorized to delete this post');
  }

  await prisma.post.delete({
    where: { id: postId },
  });
  return { message: 'Post deleted successfully' };
};

const getFeed = async (userId, query) => {
  const { skip, take, page, limit } = getPaginationParams(query);

  const followingIds = await prisma.follower
    .findMany({
      where: { followerId: userId },
      select: { followingId: true },
    })
    .then((arr) => arr.map((f) => f.followingId));

  followingIds.push(userId);

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { authorId: { in: followingIds } },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: postInclude,
    }),
    prisma.post.count({
      where: { authorId: { in: followingIds } },
    }),
  ]);

  return {
    data: posts.map((p) => formatPost(p, userId)),
    pagination: buildPaginationMeta(total, page, limit),
  };
};

function formatPost(post, currentUserId) {
  const userReaction = post.reactions.find((r) => r.userId === currentUserId);
  const reactionCounts = post.reactions.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {});

  return {
    ...post,
    commentsCount: post._count.comments,
    reactionCounts,
    userReaction: userReaction || null,
    reactions: undefined,
    _count: undefined,
  };
}

module.exports = {
  create,
  getById,
  update,
  remove,
  getFeed,
};
