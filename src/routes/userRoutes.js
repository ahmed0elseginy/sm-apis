const express = require('express');
const userController = require('../controllers/userController');
const validate = require('../middlewares/validate');
const { auth } = require('../middlewares/auth');
const {
  updateProfileSchema,
  followSchema,
  getUserIdSchema,
} = require('../validators/userValidator');

const router = express.Router();

router.use(auth);

router.get('/:id', validate(getUserIdSchema), userController.getProfile);
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);
router.post('/:id/follow', validate(followSchema), userController.follow);
router.delete('/:id/follow', validate(followSchema), userController.unfollow);
router.get('/:id/followers', validate(getUserIdSchema), userController.getFollowers);
router.get('/:id/following', validate(getUserIdSchema), userController.getFollowing);

module.exports = router;
