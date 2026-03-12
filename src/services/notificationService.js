const prisma = require('../utils/prisma');
const { getPaginationParams, buildPaginationMeta } = require('../utils/pagination');

const create = async ({ type, userId, actorId, postId, commentId }) => {
  return prisma.notification.create({
    data: {
      type,
      userId,
      actorId,
      postId,
      commentId,
    },
  });
};

const listByUser = async (userId, query) => {
  const { skip, take, page, limit } = getPaginationParams(query);

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        actor: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    }),
    prisma.notification.count({
      where: { userId },
    }),
  ]);

  return {
    data: notifications,
    pagination: buildPaginationMeta(total, page, limit),
  };
};

const markAsRead = async (notificationId, userId) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification || notification.userId !== userId) {
    return null;
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
};

const markAllAsRead = async (userId) => {
  await prisma.notification.updateMany({
    where: { userId },
    data: { read: true },
  });
  return { message: 'All notifications marked as read' };
};

module.exports = {
  create,
  listByUser,
  markAsRead,
  markAllAsRead,
};
