const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

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

// signup approach
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({ 'email': email }, (err, user) => {
        if (err) { 
            return done(err); 
        }

        // user exist
        if (user) { 
            return(null, false, req.flash('error', 'User already exist'));
        }

        // create a new user
        let newUser = new User();
        newUser.username = req.body.username;
        newUser.fullName = req.body.username;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);

        newUser.save((err, result) => {
            if (err) return done(err);
            
            return done(null, newUser);
        });
    });
}));


// signin approach
passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({ 'email': email }, (err, user) => {
        if (err) { 
            return done(err); 
        }

        const errorMessages = [];
        if (!user || !user.validUserPassword(password)) {
            errorMessages.push('User not exist or Password is Incorrect');
            return done(null, false, req.flash('error', errorMessages));
        }

        return done(null, user);
    });
}));