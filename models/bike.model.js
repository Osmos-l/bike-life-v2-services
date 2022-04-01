const mongoose = require('mongoose');

const bikeSchema = mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users'},
    name: {type: String, required: true}
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

module.exports = mongoose.model("bikes", bikeSchema);
