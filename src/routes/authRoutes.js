const express = require('express');

const authController = require('../controllers/authController');

const validate = require('../middlewares/validate');

const { registerSchema, loginSchema } = require('../validators/authValidator');

const { authLimiter } = require('../middlewares/rateLimiter');



const router = express.Router();



router.post('/register', authLimiter, validate(registerSchema), authController.register);

router.post('/login', authLimiter, validate(loginSchema), authController.login);



module.exports = router;
