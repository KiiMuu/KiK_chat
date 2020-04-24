const { check } = require('express-validator');

module.exports = () => {
    return {
        SignUpValidation: (req, res, next) => {
            check('username', 'Username is required').notEmpty();
            check('username', 'Username Must not be less than 3').isLength({ min: 3 });
            check('email', 'Email is required').notEmpty();
            check('email', 'Invalid email').isEmail();
            check('password', 'Password is required').notEmpty();
            check('password', 'Password Must not be less than 6').isLength({ min: 6 });
        
            req.getValidationResult().then(result => {
                const errors = result.array();
                const messages = [];
                errors.forEach(error => {
                    messages.push(error.msg);
                });
    
                req.flash('error', messages);
    
                res.redirect('auth/signup');
            }).catch(err => {
                return next();
            });
        }
    }
}

// exports.SignUpValidation = (req, res, next) => {
//     check('username', 'Username is required').notEmpty();
//     check('username', 'Username Must not be less than 3').isLength({ min: 3 });
//     check('email', 'Email is required').notEmpty();
//     check('email', 'Invalid email').isEmail();
//     check('password', 'Password is required').notEmpty();
//     check('password', 'Password Must not be less than 6').isLength({ min: 6 });

//     req.getValidationResult()
//         .then(result => {
//             const errors = result.array();
//             const messages = [];
//             errors.forEach(error => {
//                 messages.push(error.msg);
//             });

//             req.flash('error', messages);

//             res.redirect('auth/signup');
//         }).catch(err => {
//             return next();
//         });
// }