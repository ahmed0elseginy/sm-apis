const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const data = req.validBody;
    const result = await authService.register(data);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const data = req.validBody;
    const result = await authService.login(data);
    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
