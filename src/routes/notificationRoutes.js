const express = require('express');
const notificationController = require('../controllers/notificationController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.use(auth);

router.get('/', notificationController.list);
router.put('/:id/read', notificationController.markAsRead);
router.put('/read-all', notificationController.markAllAsRead);

module.exports = router;
