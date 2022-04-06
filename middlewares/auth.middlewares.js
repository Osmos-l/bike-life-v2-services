const responseRepository = require('../repository/response.repository');
const userRepository = require('../repository/user.repository');
const Token = require('../token');

module.exports = async (req, res, next) => {
    try {
        const userIdFromBodyRequest = req.body.userId || req.params.ownerId;

        const token = Token.getTokenFromReqHeader(req);
        const userIdFromJWT = Token.getUserIdFromToken(token);

        if (userIdFromJWT == userIdFromBodyRequest) {
            // Can throw an error
            req.body.owner = await userRepository.findOneById(userIdFromJWT);

            next();
        } else {
            throw 'Bad access token';
        }
    } catch (e) {
        console.log(e);
        responseRepository.notAuthenticated(res);
    }
}
