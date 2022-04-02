const jwt = require('jsonwebtoken');
const responseRepository = require('../repository/response.repository');
const userRepository = require('../repository/user.repository');

const getTokenFromRequest = (req) => {
    return req.headers.authorization.split(' ')[1];
};

const getUserIdFromToken = (token) => {
    try {
        const decodedToken = jwt.verify(token, "stub");
        return decodedToken.ID;
    } catch( error ) {
        throw error;
    }
}

module.exports = async (req, res, next) => {
    try {
        const userIdFromBodyRequest = req.body.userId || req.params.ownerId;

        const token = getTokenFromRequest(req);
        const userIdFromJWT = getUserIdFromToken(token);

        if (userIdFromJWT == userIdFromBodyRequest) {
            // Can throw an error
            req.body.owner = await userRepository.findOneById(userIdFromJWT);

            next();
        } else {
            throw 'Bad access token';
        }
    } catch (e) {
        responseRepository.notAuthenticated(res);
    }
}
