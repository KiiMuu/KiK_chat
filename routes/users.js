const express = require('express');
const { check, validationResult, body } = require('express-validator/check');

// controllers
const usersController = require('../controllers/users');

const router = express.Router();

router.get('/', usersController.homePage);
// sign up
router.get('/signup', usersController.getSignUp);
router.post('/signup',
    [
        check('username', 'Username is Required').not().isEmpty(),
        check('username', 'Username Must not be less than 3').isLength({ min: 3 }),
        check('email', 'Email is Required').not().isEmpty(),
        check('email', 'Invalid Email').isEmail(),
        check('password', 'Password is Required').not().isEmpty(),
        check('password', 'Password Must not be less than 6').isLength({ min: 6 }).trim()
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            res.render('auth/signup', {
                PageTitle: 'Sign Up',
                errorMessages: errors.array().msg,
                oldInputs: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password
                },
                validationErrors: errors.array()
            });
        }
        next();
    },
    usersController.postSignUp
);
// signin
router.get('/signin', usersController.getSignIn);
router.post('/signin',
    [
        body('email')
        .isEmail()
        .withMessage('Invalid Email')
        .normalizeEmail(),
        body('password', 'Password is Incorrect')
        .isLength({ min: 6 })
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            res.render('auth/signin', {
                PageTitle: 'Sign In',
                errorMessages: errors.array().msg,
                oldInputs: {
                    email: req.body.email,
                    password: req.body.password
                },
                validationErrors: errors.array()
            });
        }
        next();
    },
    usersController.postSignIn
);
// FB Auth
router.get('/auth/facebook', usersController.getFacebookAuth);
router.get('/auth/facebook/callback', usersController.facebookAuth);


module.exports = router;