const responseRepository = require('../repository/response.repository');
const userRepository = require('../repository/user.repository');
const refreshTokenRepository = require('../repository/refresh_token.repository');
const Token = require('../token');

const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { username, password, rememberMe } = req.body;

    try {
        const user = await userRepository.findOneByUsername(username);
        const isValid = await user.comparePassword(password);
        if (!isValid) {
            throw 'Bad password';
        }


        const tokens = {
            accessToken: await user.getAccessToken()
        };
        if (rememberMe) {
            tokens.refreshToken = await user.getRefreshToken();
        }
        return responseRepository.login(res, user.toJSON(), tokens);
    } catch (e) {
        return responseRepository.error(res, { msg: 'Invalid credentials' });
    }
}

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await userRepository.create(email, username, password);

        return responseRepository.created(res, user.toJSON());
    } catch (errors) {
        return responseRepository.error(res, errors);
    }

}

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        const decodedToken = await jwt.verify(refreshToken, process.env.PAYLOAD_TOKENS);
        if (!decodedToken || !decodedToken.ID) {
            throw "Incorrect refresh token";
        }
        const user = await userRepository.findOneById(decodedToken.ID);
        if (!user) {
            throw "User not find";
        }

        const refreshTokenSaved = await refreshTokenRepository.getUserToken(user);
        if (!refreshTokenSaved || refreshTokenSaved.token !== refreshToken) {
            throw "Refresh token do not match token in database";
        }

        const accessToken = await user.getAccessToken();
        return responseRepository.good(res, {accessToken});
    } catch (e) {
        console.error(e);
        return responseRepository.error(res, "Impossible to refresh with this token");
    }

}

exports.getUser = async (req, res) => {
    try {
        const accessToken = Token.getTokenFromReqHeader(req);
        const userId = Token.getUserIdFromToken(accessToken);

        const user = await userRepository.findOneById(userId);
        if (!user) {
            throw 'User not found';
        }

        return responseRepository.good(res, { user: user.toJSON() });
    } catch (e) {
        return responseRepository.error(res, "Cannot get user");
    }
}

exports.logout = async (req, res) => {
    const { refreshToken } = req.body

    try {
        const decodedToken = await jwt.verify(refreshToken, process.env.PAYLOAD_TOKENS);
        if (!decodedToken || !decodedToken.ID) {
            throw "Incorrect refresh token";
        }
        const user = await userRepository.findOneById(decodedToken.ID);
        if (!user) {
            throw "User not find";
        }

        await refreshTokenRepository.deleteUserToken(user);
    } catch (e) {
        console.error(e);
    }

    return responseRepository.good(res, "Logout with success");
}
