const mongoose = require('mongoose');

const refreshTokenSchema = mongoose.Schema({
    token: {type: String , required: true },
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users'}
}, { timestamps: { createdAt: 'created_at' }});


module.exports = mongoose.model("refresh_token", refreshTokenSchema);
