exports.indexPage = (req, res, next) => {
    res.render('index', {
        test: 'This is a Test'
    });
}

exports.getSignUp = (req, res, next) => {
    res.render('auth/signup');
}