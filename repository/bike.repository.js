const Bike = require('../models/bike.model');

exports.create = async (owner, name) => {
    const bike = new Bike({ owner: owner.id, name });

    return await bike.save();
}

exports.getBikesFromOwner = async (owner) => {
    const bikes = await Bike.find({ owner: owner.id });

    return bikes;
}

exports.countBikesFromOwner = async (owner) => {
    const numBikes = await Bike.countDocuments({ owner: owner.id });

    return numBikes;
}
