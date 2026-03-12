const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const prisma = require('../utils/prisma');
const config = require('../config');

const hashPassword = async (password) => {
  return bcrypt.hash(password, config.bcrypt.rounds);
};

const comparePassword = async (plain, hashed) => {
  return bcrypt.compare(plain, hashed);
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

const register = async ({ email, username, password, name }) => {
  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: hashed,
      name: name || username,
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
    },
  });
  const token = generateToken(user.id);
  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user.id);
  const { password: _, ...safeUser } = user;
  return { user: safeUser, token };
};

module.exports = {
  register,
  login,
  hashPassword,
  comparePassword,
  generateToken,
};
