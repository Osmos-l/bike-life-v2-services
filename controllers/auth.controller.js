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
        const access_token = await user.getAccessToken();
        // const refresh_token = await user.getRefreshToken();
        return responseRepository.login(res, access_token, 'stub');
    } catch (e) {
        return responseRepository.error(res, { msg: 'Invalid credentials' });
    }


    return responseRepository.created(res, {});
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
