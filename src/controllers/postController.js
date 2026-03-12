const postService = require('../services/postService');

const create = async (req, res, next) => {
  try {
    const data = req.validBody;
    const post = await postService.create(req.userId, data);
    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.validParams;
    const post = await postService.getById(id, req.userId);
    res.json({
      success: true,
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.validParams;
    const data = req.validBody;
    const post = await postService.update(id, req.userId, data);
    res.json({
      success: true,
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.validParams;
    await postService.remove(id, req.userId);
    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

const getFeed = async (req, res, next) => {
  try {
    const query = req.validQuery || req.query;
    const result = await postService.getFeed(req.userId, query);
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
  getById,
  update,
  remove,
  getFeed,
};
