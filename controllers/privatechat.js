const async = require('async');

const Users = require('../models/user');
const Message = require('../models/message');

exports.getChatPage = (req, res, next) => {
    async.parallel([
        (cb) => {
            Users.findOne({ 'username': req.user.username }).populate('request.userId').exec((err, result) => {
                cb(err, result);
            });
        },

        (cb) => {
            Message.aggregate(
                {
                    // $match => make a condition
                    $match: {
                        // $or => at least match one of the following expressions
                        $or: [
                            {'senderName': req.user.username},
                            {'recieverName': req.user.username}
                        ]
                    }
                },
                // $sort => sort data by createdAt field - recent
                {$sort: {
                    'createdAt': -1
                }},
                {
                    $group: {
                        '_id': {
                            'last_message_between': {
                                $cond: [
                                    {
                                        // $gt => greater than
                                        $gt: [
                                            // $senderName => the string
                                            // 0 => start the position of the string, 1 => length
                                            {$substr: ['$senderName', 0, 1]},
                                            {$substr: ['$recieverName', 0, 1]},
                                        ]
                                    },
                                    {$concat: ['$senderName', ' and ', '$recieverName']},
                                    {$concat: ['$recieverName', ' and ', '$senderName']}
                                ]
                            },
                            'body': {
                                $first: '$$ROOT'
                            }
                        }
                    }
                },
                (err, newResult) => {
                    cb(err, newResult);
                }
            )
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