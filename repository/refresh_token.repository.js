const RefreshToken = require('../models/refresh_token.model');

exports.insert = async (user, token) => {
    const refreshToken = new RefreshToken({user: user._id, token });

    return await refreshToken.save();
}

exports.getUserToken = async (user) => {
    const refreshToken = await RefreshToken.findOne({user: user._id });

    return refreshToken;
}

exports.deleteUserToken = async (user) => {
    const res = await RefreshToken.deleteOne({user: user._id});

    return res;
}

exports.deleteExpiredTokens = async () => {
    const searchDate = new Date();
    searchDate.setDate(searchDate.getDate() - 15);

    const res = await RefreshToken.deleteMany({created_at: {
            $lte: searchDate
        }})

    return res;
}
