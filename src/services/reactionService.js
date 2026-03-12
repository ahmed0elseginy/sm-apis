const ApiError = require('../utils/ApiError');
const prisma = require('../utils/prisma');
const notificationService = require('./notificationService');

const create = async (userId, { postId, type }) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, authorId: true },
  });

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const reaction = await prisma.reaction.upsert({
    where: {
      postId_userId: { postId, userId },
    },
    create: {
      postId,
      userId,
      type,
    },
    update: { type },
    include: {
      post: {
        include: {
          author: { select: { id: true } },
        },
      },
    },
  });

  if (post.authorId !== userId) {
    await notificationService.create({
      type: 'LIKE',
      userId: post.authorId,
      actorId: userId,
      postId,
    });
  }

  return reaction;
};

const remove = async (reactionId, userId) => {
  const reaction = await prisma.reaction.findUnique({
    where: { id: reactionId },
  });

  if (!reaction) {
    throw new ApiError(404, 'Reaction not found');
  }

  if (reaction.userId !== userId) {
    throw new ApiError(403, 'Not authorized to remove this reaction');
  }

  await prisma.reaction.delete({
    where: { id: reactionId },
  });
  return { message: 'Reaction removed successfully' };
};

const getByPostAndUser = async (postId, userId) => {
  return prisma.reaction.findUnique({
    where: {
      postId_userId: { postId, userId },
    },
  });
};

module.exports = {
  create,
  remove,
  getByPostAndUser,
};
