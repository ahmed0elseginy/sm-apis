const express = require('express');
const commentController = require('../controllers/commentController');
const validate = require('../middlewares/validate');
const { auth } = require('../middlewares/auth');
const {
  createCommentSchema,
  deleteCommentSchema,
  listCommentsSchema,
} = require('../validators/commentValidator');

const router = express.Router();

router.use(auth);

router.post('/', validate(createCommentSchema), commentController.create);
router.delete('/:id', validate(deleteCommentSchema), commentController.remove);
router.get('/post/:postId', validate(listCommentsSchema), commentController.listByPost);

module.exports = router;
