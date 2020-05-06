const async = require('async');

const Users = require('../models/user');

exports.groupPage = (req, res, next) => {
    const name = req.params.name;

    async.parallel([
        (cb) => {
            Users.findOne({ 'username': req.user.username }).populate('request.userId').exec((err, result) => {
                cb(err, result);
            });
        }
    ], (err, results) => {
        const result1 = results[0];
        
        res.render('groupchat/group', {
            pageTitle: 'Group',
            groupName: name,
            user: req.user,
            data: result1
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
}

exports.logout = (req, res, next) => {
    req.logout();
    req.session.destroy(err => {
        res.redirect('/');
    });
}