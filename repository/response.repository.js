exports.created = (res, data) => {
    return res.status(201).json(data);
}

exports.good = (res, data) => {
    return res.status(200).json(data);
}

exports.setAccessToken = (res, token) => {
    return res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "prod"
    })
}

exports.error = (res, message) => {
    return res.status(200).json({errors: message});
}
