const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth.controller');
const { validateUserOnRegister } = require('../validators/auth.validator');

router.post('/login', controller.login)

router.post('/register', validateUserOnRegister, controller.register)

module.exports = router;
