exports.created = (res, data) => {
    return res.status(201).json(data);
}

exports.good = (res, data) => {
    return res.status(200).json(data);
}

exports.login = (res, accessToken, refreshToken) => {
    return this.good(res, {accessToken, refreshToken});
}

exports.error = (res, message) => {
    return res.status(200).json({errors: message});
}
