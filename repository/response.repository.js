exports.created = (res, data) => {
    return res.status(201).json(data);
}

exports.error = (res, message) => {
    return res.status(200).json({errors: message});
}
