const { User } = require("../entity/user.entity");

exports.modelToEntity = (userModel) => {
    const userEntity = new User();

    userEntity.id = userModel._id;
    userEntity.email = userModel.email;
    userEntity.username = userModel.username;
    userEntity.password = userModel.password;
    userEntity.created_at = userModel.created_at;
    userEntity.updated_at = userModel.updated_at;

    return userEntity;
}
