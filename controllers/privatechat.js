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
            const nameRegex = new RegExp("^" + req.user.username.toLowerCase(), "i")
            Message.aggregate([
                {
                    $match: {
                        $or: [
                            {"senderName": nameRegex}, 
                            {"recieverName": nameRegex}
                        ]
                    }
                },
                {
                    $sort: {
                        "createdAt": -1
                    }
                },
                {
                    $group: {
                        "_id": {
                            "last_message_between": {
                                $cond: [{
                                    $gt: [
                                        {$substr: ["$senderName", 0, 1]},
                                        {$substr: ["$recieverName", 0, 1]}
                                    ]},

                                    {$concat: ["$senderName", " and ", "$recieverName"]},
                                    {$concat: ["$recieverName", " and ", "$senderName"]}
                                ]
                            }
                        }, 
                        "body": {
                            $first: "$$ROOT"
                        }
                    }
                }], (err, newResult) => {
                    console.log(newResult);
                    cb(err, newResult);
                }
            )
        },

        (cb) => {
            Message.find({'$or': [{'senderName': req.user.username}, {'revieverName': req.user.username}]}).populate('sender').populate('reciever').exec((err, result3) => {
                cb(err, result3);
            });
        }
    ], (err, results) => {
        const result1 = results[0];
        const result2 = results[1];
        const result3 = results[2];

        const params = req.params.name.split('.');
        const nameParams = params[0];
        
        res.render('private/privatechat', {
            pageTitle: 'Private Chat',
            user: req.user,
            data: result1,
            chat: result2,
            chats: result3,
            name: nameParams
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