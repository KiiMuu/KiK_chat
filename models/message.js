const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    message: {
        type: String
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    senderName: {
        type: String
    },
    recieverName: {
        type: String
    },
    userImage: {
        type: String,
        default: 'default.png'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', messageSchema);