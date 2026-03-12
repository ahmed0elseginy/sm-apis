const commentService = require('../services/commentService');

const create = async (req, res, next) => {
  try {
    const data = req.validBody;
    const comment = await commentService.create(req.userId, data);
    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.validParams;
    await commentService.remove(id, req.userId);
    res.json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

const listByPost = async (req, res, next) => {
  try {
    const { postId } = req.validParams;
    const result = await commentService.listByPost(postId, req.query);
    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  remove,
  listByPost,
};
