const async = require('async');

const Club = require('../models/club');
const Users = require('../models/user');

exports.indexPage = (req, res, next) => {
    res.render('index', {
        pageTitle: 'Home'
    });
}

// Clubs
exports.homePage = (req, res, next) => {
    async.parallel([
        (callback) => {
            Club.find({}, (err, result) => {
                callback(err, result);
            });
        },

        (callback) => {
            Club.aggregate([{
                $group: {
                    _id: "$country"
                }
            }], (err, newResult) => {
                callback(err, newResult);
            });
        },

        (cb) => {
            Users.findOne({ 'username': req.user.username }).populate('request.userId').exec((err, result) => {
                cb(err, result);
            });
        }
    ], (err, results) => {
        const res1 = results[0];
        const res2 = results[1];
        const res3 = results[2];

        const dataChunk = [];
        const chunkSize = 3;

        for (let i = 0; i < res1.length; i += chunkSize) {
            dataChunk.push(res1.slice(i, i + chunkSize));
        }

        // sort alphabetically
        const sortCountry = res2.sort((a, b) => {
            if (a._id < b._id) return -1;
        });

        res.render('home', {
            pageTitle: 'Clubs',
            chunks: dataChunk,
            data: res3,
            country: sortCountry,
            user: req.user
        });
    });
}


exports.postHomePage = (req, res, next) => {
    async.parallel([
        (cb) => {
            Club.updateOne({
                '_id': req.body.id,
                'fans.username': {
                    $ne: req.user.username
                }
            }, {
                $push: {
                    fans: {
                        username: req.user.username,
                        email: req.user.email
                    }
                }
            }, (err, count) => {
                console.log(count);
                cb(err, count);
            });
        }
    ], (err, results) => {
        res.redirect('/clubs');
    });
}

exports.logout = (req, res, next) => {
    req.logout();
    req.session.destroy(err => {
        res.redirect('/');
    });
}
