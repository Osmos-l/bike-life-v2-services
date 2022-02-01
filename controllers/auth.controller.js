const responseRepository = require('../repository/response.repository');
const userRepository = require('../repository/user.repository');

exports.login = async (req, res) => {
    return responseRepository.created(res, {});
}

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await userRepository.create(email, username, password);

        return responseRepository.created(res, user);
    } catch (e) {
        return responseRepository.error(res, e.message);
    }

}
