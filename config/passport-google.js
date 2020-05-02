const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = require('../models/user');
const secret = require('../secret/secretFile');

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
passport.use(new GoogleStrategy({
    clientID: secret.google.clientID,
    clientSecret: secret.google.clientSecret,
    profileFields: ['emails'],
    callbackURL: 'http://localhost:3001/auth/google/callback',
    passReqToCallback: true
}, (req, accessToken, refeshToken, profile, done) => {
    User.findOne({ google: profile.id }, (err, user) => {
        if (err) { 
            return done(err); 
        }

        // user exist
        if (user) { 
            return(null, user);
        } else {
            // create a new user
            let newUser = new User();
            newUser.google = profile.id;
            newUser.fullName = profile.displayName;
            newUser.username = profile.displayName;
            newUser.email = profile.emails[0].value;
            newUser.userImage = `https://people.googleapis.com/v1/people/${profile.id}?personFields=photos`;

            newUser.save((err, result) => {
                if (err) return done(err);
                
                return done(null, newUser);
            });
        }
    });
}));