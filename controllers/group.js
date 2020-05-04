const async = require('async');

const Users = require('../models/user');

exports.groupPage = (req, res, next) => {
    const name = req.params.name;

    res.render('groupchat/group', {
        pageTitle: 'Group',
        groupName: name,
        user: req.user
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
                Users.update({
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
}