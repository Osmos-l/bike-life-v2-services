const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Token = require('../token');
const refreshTokenRepository = require('../repository/refresh_token.repository');

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true,
        minLength: [5, "Email is shorter than the minimum allowed length (5)"],
        maxLength: [255, "Email is longer than the maximum allowed length (255)"]},
    username: {type: String, required: true,
        minLength: [5, "Username is shorter than the minimum allowed length (5)"],
        maxLength: [50, "Username is longer than the maximum allowed length (50)"]},
    password: {type: String, required: true, minLength: 5, maxLength: 1024}
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (e) {
        next(e);
    }
})

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.getAccessToken = async function() {
    return await Token.generate({ ID: this._id }, "stub", "1min");
}

userSchema.methods.getRefreshToken = async function() {
    const refreshToken = await refreshTokenRepository.getUserToken(this);

    if (refreshToken) {
        return refreshToken.token;
    }

    const token = await Token.generate({ ID: this._id }, "stub", "1d")
    await refreshTokenRepository.insert(this, token);

    return token;
}

module.exports = mongoose.model('users', userSchema);
