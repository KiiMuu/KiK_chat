const express = require('express');
const { check, validationResult } = require('express-validator/check');

// controllers
const usersController = require('../controllers/users');

const router = express.Router();

router.get('/home', usersController.homePage);
router.get('/', usersController.indexPage);
// sign up
router.get('/signup', usersController.getSignUp);
router.post('/signup',
    [
        check('username', 'Username is required').notEmpty(),
        check('username', 'Username Must not be less than 3').isLength({ min: 3 }),
        check('email', 'Email is required').notEmpty(),
        check('email', 'Invalid email').isEmail(),
        check('password', 'Password is required').notEmpty(),
        check('password', 'Password Must not be less than 6').isLength({ min: 6 })
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

module.exports = router;