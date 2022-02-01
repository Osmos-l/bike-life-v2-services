const User = require('../models/user.model');

const checkIfUserExist = async (email, username) => {
    let user;

    user = await User.findOne({username});
    if (user) {
        throw { message: 'An user already exist with this username' };
    }
    user = await User.findOne({email});
    if (user) {
        throw { message: 'An user already exist with this email' };
    }
}

exports.create = async (email, username, password) => {
    await checkIfUserExist(email, username)

    const user = new User({email, username, password });

    return await user.save();
}
