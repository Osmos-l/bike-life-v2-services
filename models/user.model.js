const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

module.exports = mongoose.model('users', userSchema);
