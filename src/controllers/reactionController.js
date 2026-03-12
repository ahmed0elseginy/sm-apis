const reactionService = require('../services/reactionService');

const create = async (req, res, next) => {
  try {
    const data = req.validBody;
    const reaction = await reactionService.create(req.userId, data);
    res.status(201).json({
      success: true,
      data: reaction,
    });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.validParams;
    await reactionService.remove(id, req.userId);
    res.json({
      success: true,
      message: 'Reaction removed successfully',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  remove,
};
