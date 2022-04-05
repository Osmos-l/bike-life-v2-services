const responseRepository = require('../repository/response.repository');
const userRepository = require('../repository/user.repository');
const refreshTokenRepository = require('../repository/refresh_token.repository');

const jwt = require('jsonwebtoken');

const hidePassword = (user) => {
    const { password, ...info } = user._doc;
    return info;
}

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await userRepository.findOneByUsername(username);
        const isValid = await user.comparePassword(password);
        if (!isValid) {
            throw 'Bad password';
        }

        const accessToken = await user.getAccessToken();
        const refreshToken = await user.getRefreshToken();
        return responseRepository.login(res, hidePassword(user), {accessToken, refreshToken});
    } catch (e) {
        return responseRepository.error(res, { msg: 'Invalid credentials' });
    }
}

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await userRepository.create(email, username, password);

        return responseRepository.created(res, hidePassword(user));
    } catch (errors) {
        return responseRepository.error(res, errors);
    }

}

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        const decodedToken = await jwt.verify(refreshToken, "stub");
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

exports.logout = async (req, res) => {
    const { refreshToken } = req.body

    try {
        const decodedToken = await jwt.verify(refreshToken, "stub");
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
