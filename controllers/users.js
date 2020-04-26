const passport = require('passport');

// Home
exports.homePage = (req, res, next) => {
    res.render('home');
}

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