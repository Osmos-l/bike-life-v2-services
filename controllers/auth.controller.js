const responseRepository = require('../repository/response.repository');
const userRepository = require('../repository/user.repository');

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
        const refreshToken = "stub" // await user.getRefreshToken();
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
