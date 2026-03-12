const notificationService = require('../services/notificationService');

const list = async (req, res, next) => {
  try {
    const result = await notificationService.listByUser(req.userId, req.query);
    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.markAsRead(id, req.userId);
    res.json({
      success: true,
      data: notification,
    });
  } catch (err) {
    next(err);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAllAsRead(req.userId);
    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  list,
  markAsRead,
  markAllAsRead,
};
