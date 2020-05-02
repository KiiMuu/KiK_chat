const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    fullName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        default: '' // default we be the value if the user sign in with facebook or google account
    },
    userImage: {
        type: String,
        default: 'default.png'
    },
    // Oauth
    facebook: {
        type: String,
        default: ''
    },
    fbTokens: Array,
    google: {
        type: String,
        default: ''
    },
    // friend request implement
    sentRequest: [{
        username: {
            type: String,
            default: ''
        }
    }],
    request: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: {
            type: String,
            default: ''
        }
    }],
    friendList: [{
        friendId: {
            type: mongoose.Schema.Types.ObjectId
        },
        friendName: {
            type: String,
            default: ''
        }
    }],
    totalRequest: {
        type: Number,
        default: 0
    }
});

userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

userSchema.methods.validUserPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', userSchema);