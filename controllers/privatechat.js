const async = require('async');

const Users = require('../models/user');
const Message = require('../models/message');

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

exports.postChatPage = (req, res, next) => {
    const params = req.params.name.split('.');
    const nameParams = params[0];
    const nameRegex = new RegExp('^'+nameParams.toLowerCase(), 'i');

    async.waterfall([
        (cb) => {
            if (req.body.message) {
                Users.findOne({'username': {$regex: nameRegex}}, (err, data) => {
                    cb(err, data);
                });
            }
        },

        (data, cb) => {
            if (req.body.message) {
                const newMessage = new Message({
                    sender: req.user._id,
                    reciever: data._id,
                    senderName: req.user.username,
                    recieverName: data.username,
                    message: req.body.message,
                    userImage: req.user.UserImage,
                    createdAt: new Date()
                });

                newMessage.save((err, result) => {
                    if (err) {
                        return next(err);
                    }

                    console.log(result);
                    cb(err, result);
                });
            }
        }
    ], (err, results) => {
        res.redirect('/chat/'+req.params.name);
    });
}