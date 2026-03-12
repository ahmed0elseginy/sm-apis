const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');
const commentRoutes = require('./commentRoutes');
const reactionRoutes = require('./reactionRoutes');
const notificationRoutes = require('./notificationRoutes');
const config = require('../config');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/reactions', reactionRoutes);
router.use('/notifications', notificationRoutes);

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Social Media API is running',
    version: '1.0.0',
    env: config.env,
  });
});

module.exports = router;
