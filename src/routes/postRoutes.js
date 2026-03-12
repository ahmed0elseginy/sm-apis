const express = require('express');
const postController = require('../controllers/postController');
const validate = require('../middlewares/validate');
const { auth } = require('../middlewares/auth');
const {
  createPostSchema,
  updatePostSchema,
  postIdSchema,
  feedQuerySchema,
} = require('../validators/postValidator');

const router = express.Router();

router.get('/feed', auth, validate(feedQuerySchema), postController.getFeed);
router.get('/:id', auth, validate(postIdSchema), postController.getById);
router.post('/', auth, validate(createPostSchema), postController.create);
router.put('/:id', auth, validate(updatePostSchema), postController.update);
router.delete('/:id', auth, validate(postIdSchema), postController.remove);

module.exports = router;
