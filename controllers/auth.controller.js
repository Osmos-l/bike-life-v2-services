const responseRepository = require('../repository/response.repository');
const userRepository = require('../repository/user.repository');
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

        // TODO: Refresh token
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
    try {
        const cookies = getReqCookies(req);
        const refreshToken = cookies["refresh_token"];

        if (!refreshToken) {
            return responseRepository.error(res, "Bad refresh token");
        }

        const payload = await jwt.verify(refreshToken, "stub");
        const accessToken = await jwt.sign({ ID: payload.ID }, "stub", {
            expiresIn: "1min"
        });
        return responseRepository.created(res, accessToken);
    } catch (e) {
        console.log(e);
        return responseRepository.error(res, e.message);
    }
}


const getReqCookies = (req) => {
    const rawCookies = req.headers.cookie.split("; ");

    const parsedCookies = {};
    rawCookies.forEach(rawCookie => {
        const parsedCookie = rawCookie.split("=");

        if (parsedCookie.length == 2) {
            parsedCookies[parsedCookie[0]] = parsedCookie[1];
        }
    })
    return parsedCookies;
}
