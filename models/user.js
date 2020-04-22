const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    fullName: {
        type: String,
        unique: true,
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
    googleTokens: Array
});

module.exports = mongoose.model('User', userSchema);