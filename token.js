const jwt = require('jsonwebtoken');

exports.generate = async (payload, token, duration) => {
    return await jwt.sign(payload, token, {expiresIn: duration});
}

exports.getTokenFromReqHeader = (req) => {
    return req.headers.authorization.split(' ')[1];
}

exports.getUserIdFromToken = (token) => {
    try {
        const decodedToken = jwt.verify(token, process.env.PAYLOAD_TOKENS);
        return decodedToken.ID;
    } catch( error ) {
        throw error;
    }
}
