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
}