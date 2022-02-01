const { check, validationResult } = require('express-validator');

exports.validateUserOnRegister = [
    check('username')
        .isString()
        .notEmpty()
        .withMessage('Username is required')
        .bail()
        .isLength({min: 5, max: 50})
        .withMessage('Username must be 5 to 50 characters length !')
        .bail(),
    check('email')
        .isEmail()
        .withMessage('Email must be a valid email')
        .bail()
        .isLength({min: 5, max: 255})
        .withMessage('Email must be 5 to 255 characters length !'),
    check('password')
        .isString()
        .notEmpty()
        .withMessage('Password is required')
        .bail()
        .isLength({min: 5, max: 100})
        .withMessage('Password must be 5 to 500 characters length !'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({errors: errors.array()})
        } else {
            next();
        }
    }
]
