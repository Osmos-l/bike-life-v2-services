const responseRepository = require('../repository/response.repository');
const bikeRepository = require('../repository/bike.repository');
const userRepository = require('../repository/user.repository');

exports.create = async (req, res) => {
    const { owner, name } = req.body;

    const nbBikes = await bikeRepository.countBikesFromOwner(owner);
    if (nbBikes > 5) {
        return responseRepository.error(res, "Bikes are limited to 5 per user !");
    }

    let bike;
    try {
        bike = await bikeRepository.create(owner, name);
    } catch (e) {
        return responseRepository.error(res, e);
    }

    return responseRepository.created(res, bike);
}


exports.getBikesFromOwner = async (req, res) => {
    const owner = req.body.owner;

    const bikes = await bikeRepository.getBikesFromOwner(owner);

    return responseRepository.good(res, { bikes });
}
