const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

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
passport.use(new FacebookStrategy({
    clientID: secret.facebook.clientID,
    clientSecret: secret.facebook.clientSecret,
    profileFields: ['email', 'displayName', 'photos'],
    callbackURL: 'http://localhost:3001/auth/facebook/callback',
    passReqToCallback: true
}, (req, token, refeshToken, profile, done) => {
    User.findOne({ facebook: profile.id }, (err, user) => {
        if (err) { 
            return done(err); 
        }

        // user exist
        if (user) { 
            return(null, user);
        } else {
            // create a new user
            let newUser = new User();
            newUser.facebook = profile.id;
            newUser.fullName = profile.displayName;
            newUser.email = profile._json.email
            newUser.userImage = `https://graph.facebook.com/${profile.id}/picture?type=large`;
            newUser.fbTokens.push({ token });

            newUser.save((err, result) => {
                if (err) return done(err);
                
                return done(null, newUser);
            });
        }
    });
}));