const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Models
const User = require('../models/user');

// get user ID && set it in the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});