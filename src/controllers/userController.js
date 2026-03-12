const userService = require('../services/userService');

const getProfile = async (req, res, next) => {
  try {
    const { id } = req.validParams;
    const user = await userService.getById(id, req.userId);
    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const data = req.validBody;
    const user = await userService.updateProfile(req.userId, data);
    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

const follow = async (req, res, next) => {
  try {
    const { id: followingId } = req.validParams;
    await userService.follow(req.userId, followingId);
    res.json({
      success: true,
      message: 'Followed successfully',
    });
  } catch (err) {
    next(err);
  }
};

const unfollow = async (req, res, next) => {
  try {
    const { id: followingId } = req.validParams;
    await userService.unfollow(req.userId, followingId);
    res.json({
      success: true,
      message: 'Unfollowed successfully',
    });
  } catch (err) {
    next(err);
  }
};

const getFollowers = async (req, res, next) => {
  try {
    const { id } = req.validParams;
    const result = await userService.getFollowers(id, req.query);
    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

const getFollowing = async (req, res, next) => {
  try {
    const { id } = req.validParams;
    const result = await userService.getFollowing(id, req.query);
    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  follow,
  unfollow,
  getFollowers,
  getFollowing,
};
