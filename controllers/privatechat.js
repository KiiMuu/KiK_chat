const async = require('async');

const Users = require('../models/user');

exports.getChatPage = (req, res, next) => {
    async.parallel([
        (cb) => {
            Users.findOne({ 'username': req.user.username }).populate('request.userId').exec((err, result) => {
                cb(err, result);
            });
        }
    ], (err, results) => {
        const result1 = results[0];
        
        res.render('private/privatechat', {
            pageTitle: 'Private Chat',
            user: req.user,
            data: result1
        });
    });
}