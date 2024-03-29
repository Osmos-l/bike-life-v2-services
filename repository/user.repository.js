const User = require('../models/user.model');
const { modelToEntity } = require('../mapper/user.mapper');

const checkIfUserExist = async (email, username) => {
    let errors = [];

    if (await User.findOne({username})) {
        errors.push({ msg: 'An user already exist with this username', param: 'username' });
    }
    if (await User.findOne({email})) {
        errors.push({ msg: 'An user already exist with this email', param: 'email' });
    }

    if (errors.length != 0) {
        throw errors;
    }
}

exports.create = async (email, username, password) => {
    await checkIfUserExist(email, username)

    const user = new User({email, username, password });

    return modelToEntity(await user.save());
}

exports.findOneByUsername = async (username) => {
    const user = await User.findOne({username});
    if (!user) {
        throw 'User not found';
    }

    return modelToEntity(user);
}

exports.findOneById = async (id) => {
    const user = await User.findOne({_id: id});
    if (!user) {
        throw 'User not found';
    }

    return modelToEntity(user);
}
