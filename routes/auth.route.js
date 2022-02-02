const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth.controller');
const validators = require('../validators/auth.validator');

router.post('/login', controller.login)

router.post('/register', validators.validateUserOnRegister, controller.register)

module.exports = router;
