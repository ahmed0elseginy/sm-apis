const express = require('express');
const reactionController = require('../controllers/reactionController');
const validate = require('../middlewares/validate');
const { auth } = require('../middlewares/auth');
const { createReactionSchema, deleteReactionSchema } = require('../validators/reactionValidator');

const router = express.Router();

router.use(auth);

router.post('/', validate(createReactionSchema), reactionController.create);
router.delete('/:id', validate(deleteReactionSchema), reactionController.remove);

module.exports = router;
