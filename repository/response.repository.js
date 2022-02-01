exports.created = (res, data) => {
    return res.status(201).json(data);
}

exports.MissingParameters = (res) => {
    return res.status(200).json({error: 'Missing parameters'});
}

exports.error = (res, message) => {
    return res.status(200).json({error: message});
}
