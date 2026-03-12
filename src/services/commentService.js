const ApiError = require('../utils/ApiError');
const prisma = require('../utils/prisma');
const { getPaginationParams, buildPaginationMeta } = require('../utils/pagination');
const notificationService = require('./notificationService');

const create = async (userId, { postId, content }) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, authorId: true },
  });

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const comment = await prisma.comment.create({
    data: {
      postId,
      userId,
      content,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  });

  if (post.authorId !== userId) {
    await notificationService.create({
      type: 'COMMENT',
      userId: post.authorId,
      actorId: userId,
      postId,
      commentId: comment.id,
    });
  }

  return comment;
};

const remove = async (commentId, userId) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  if (comment.userId !== userId) {
    throw new ApiError(403, 'Not authorized to delete this comment');
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });
  return { message: 'Comment deleted successfully' };
};

const listByPost = async (postId, query) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const { skip, take, page, limit } = getPaginationParams(query);

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: { postId },
      skip,
      take,
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    }),
    prisma.comment.count({
      where: { postId },
    }),
  ]);

  return {
    data: comments,
    pagination: buildPaginationMeta(total, page, limit),
  };
};

module.exports = {
  create,
  remove,
  listByPost,
};
