const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth.controller');
const validator = require('../validators/auth.validator');

router.post('/login', validator.onLogin, controller.login)

router.post('/register', validator.onRegister, controller.register)

module.exports = router;
