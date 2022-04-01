const express = require('express');
const router = express.Router();

const controller = require('../controllers/bike.controller');
const validator = require('../validators/bike.validator');
const isAuthenticatedMiddleware = require('../middlewares/auth.middlewares');

router.post('/', [isAuthenticatedMiddleware, validator.onCreate], controller.create);

router.get('/:ownerId', [isAuthenticatedMiddleware], controller.getBikesFromOwner);


module.exports = router;
