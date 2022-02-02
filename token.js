const jwt = require('jsonwebtoken');

exports.generate = async (payload, token, duration) => {
    return await jwt.sign(payload, token, {expiresIn: duration});
}
