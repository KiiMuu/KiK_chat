const passport = require('passport');

exports.homePage = (req, res, next) => {
    res.render('home');
}

exports.indexPage = (req, res, next) => {
    res.render('index', {
        test: 'This is a Test'
    });
}

exports.getSignUp = (req, res, next) => {
    res.render('auth/signup');
}

exports.postSignUp = (req, res, next) => {
    passport.authenticate('local.signup', {
        successRedirect: '/home',
        failureRedirect: 'auth/signup',
        failureFlash: true
    });
}