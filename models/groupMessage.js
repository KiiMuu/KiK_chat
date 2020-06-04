const mongoose = require('mongoose');

const groupMessageSchema = mongoose.Schema({
    body: {
        type: String
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('GroupMessage', groupMessageSchema);