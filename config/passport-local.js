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

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({ 'email': email }, (err, user) => {
        if (err) return done(err);

        // user exist
        if (user) return(null, false, req.flash('error', 'User already exist'));

        // create a new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        newUser.save(err => {
            done(null, newUser);
        });
    });
}));