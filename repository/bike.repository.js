const Bike = require('../models/bike.model');

exports.create = async (owner, name) => {
    const bike = new Bike({ owner: owner._id, name });

    return await bike.save();
}

exports.getBikesFromOwner = async (owner) => {
    const bikes = await Bike.find({ owner: owner._id });

    return bikes;
}

exports.countBikesFromOwner = async (owner) => {
    const numBikes = await Bike.countDocuments({ owner: owner._id });

    return numBikes;
}
