const passport = require('passport');

// GET signup
exports.getSignUp = (req, res, next) => {
    const messages = req.flash('error');
    res.render('auth/signup', {
        pageTitle: 'Sign Up',
        errorMessages: messages,
        oldInputs: {
            username: '',
            email: '',
            password: ''
        },
        validationErrors: []
    });
}

// POST signup
exports.postSignUp = passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: 'signup',
    failureFlash: true
})

// GET signin
exports.getSignIn = (req, res, next) => {
    let messages = req.flash('error');
    res.render('auth/signin', {
        pageTitle: 'Sign In',
        errorMessages: messages,
        oldInputs: {
            email: '',
            password: ''
        },
        validationErrors: []
    });
}

// POST signin
exports.postSignIn = passport.authenticate('local.signin', {
    successRedirect: '/',
    failureRedirect: 'signin',
    failureFlash: true
})

// FB Auth
exports.getFacebookAuth = passport.authenticate('facebook', {
    scope: 'email'
});

exports.facebookAuth = passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: 'signup',
    failureFlash: true
});

// Google Auth
exports.getGoogleAuth = passport.authenticate('google', {
    scope: [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.profile.emails.read',
        'email'
    ]
});

exports.googleAuth = passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: 'signup',
    failureFlash: true
});