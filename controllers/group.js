const async = require('async');

const Users = require('../models/user');
const Message = require('../models/message');
const GroupMessage = require('../models/groupMessage');

exports.groupPage = (req, res, next) => {
    const name = req.params.name;

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
            GroupMessage.find({}).populate('sender').exec((err, result) => {
                cb(err, result);
            });
        }
    ], (err, results) => {
        const result1 = results[0];
        const result2 = results[1];
        const result3 = results[2];
        
        res.render('groupchat/group', {
            pageTitle: 'Group',
            groupName: name,
            user: req.user,
            data: result1,
            chat: result2,
            groupMsg: result3
        });
    });
}

exports.groupPostPage = (req, res, next) => {
    async.parallel([
        (cb) => {
            if (req.body.recieverName) {
                Users.updateOne({
                    'username': req.body.recieverName,
                    'request.userId': {$ne: req.user._id}, // ne => not equal
                    'friendList.friendId': {$ne: req.user._id},

                }, {
                    $push: {
                        request: {
                            userId: req.user._id,
                            username: req.user.username
                        }
                    },
                    $inc: {
                        totalRequest: 1
                    }
                }, (err, count) => {
                    cb(err, count);
                });
            }
        },

        (cb) => {
            if (req.body.recieverName) {
                Users.updateOne({
                    'username': req.user.username,
                    'sentRequest.username': {$ne: req.body.recieverName}
                }, {
                    $push: {
                        sentRequest: {
                            username: req.body.recieverName
                        }
                    }
                }, (err, count) => {
                    cb(err, count);
                });
            }
        }
    ], (err, results) => {
        res.redirect(`/group/${req.params.name}`);
    });

    // update data when accepting friend request
    async.parallel([
        // updating at reciever
        (cb) => {
            if (req.body.senderId) {
                Users.updateOne({
                    '_id': req.user._id,
                    'friendList.friendId': {
                        $ne: req.body.senderId
                    }
                }, {
                    $push: {
                        friendList: {
                            friendId: req.body.senderId,
                            friendName: req.body.senderName
                        }
                    },
                    $pull: {
                        request: {
                            userId: req.body.senderId,
                            username: req.body.senderName
                        }
                    },
                    $inc: {
                        totalRequest: -1
                    }
                }, (err, count) => {
                    cb(err, count);
                });
            }
        },

        // updating at sender
        (cb) => {
            if (req.body.senderId) {
                Users.updateOne({
                    '_id': req.body.senderId,
                    'friendList.friendId': {
                        $ne: req.user._id
                    }
                }, {
                    $push: {
                        friendList: {
                            friendId: req.user._id,
                            friendName: req.user.username
                        }
                    },
                    $pull: {
                        sentRequest: {
                            username: req.user.username
                        }
                    }
                }, (err, count) => {
                    cb(err, count);
                });
            }
        },

        // decline friend request at reciever
        (cb) => {
            if (req.body.user_id) {
                Users.updateOne({
                    '_id': req.user._id,
                    'request.userId': {
                        $eq: req.body.user_id
                    }
                }, {
                    $pull: {
                        request: {
                            userId: req.body.user_id
                        }
                    },
                    $inc: {
                        totalRequest: -1
                    }
                }, (err, count) => {
                    cb(err, count);
                });
            }
        },

        // update data at sender
        (cb) => {
            if (req.body.user_id) {
                Users.updateOne({
                    '_id': req.body.user_id,
                    'sentRequest.username': {
                        $eq: req.user.username
                    }
                }, {
                    $pull: {
                        sentRequest: {
                            username: req.user.username
                        }
                    }
                }, (err, count) => {
                    cb(err, count);
                });
            }
        }
    ], (err, results) => {
        res.redirect(`/group/${req.params.name}`);
    });

    async.parallel([
        (data, cb) => {
            if (req.body.message) {
                const newMessage = new GroupMessage({
                    sender: req.user._id,
                    body: req.body.message,
                    name: req.body.groupName,
                    createdAt: new Date()
                });

                newMessage.save((err, msg) => {
                    if (err) {
                        return next(err);
                    }

                    console.log(msg);
                    cb(err, msg);
                });
            }
        }
    ], (err, results) => {
        res.redirect('/group/'+req.params.name);
    });
}

exports.logout = (req, res, next) => {
    req.logout();
    req.session.destroy(err => {
        res.redirect('/');
    });
}