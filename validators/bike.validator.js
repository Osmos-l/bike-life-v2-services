const { check, validationResult } = require('express-validator');
const responseRepository = require('../repository/response.repository');

exports.onCreate = [
    check('name')
        .notEmpty()
        .withMessage('name is required')
        .bail()
        .isString()
        .withMessage('name must be a String')
        .bail()
        .isLength({min: 5, max: 50})
        .withMessage('name must be 5 to 50 characters length !')
        .bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseRepository.error(res, errors.array());
        } else {
            next();
        }
    }
]
