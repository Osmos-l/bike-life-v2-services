exports.created = (res, data) => {
    return res.status(201).json(data);
}

exports.good = (res, data) => {
    return res.status(200).json(data);
}

exports.login = (res, user, {accessToken, refreshToken}) => {
    return res
        .status(200)
        .json({
            tokens: {accessToken, refreshToken},
            user
        });
}

exports.error = (res, message) => {
    return res.status(200).json({errors: message});
}

exports.notAuthenticated = (res) => {
    return res.status(403).json({error: "Not authenticated"});
}
