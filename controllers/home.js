const async = require('async');

const Club = require('../models/club');

// Home
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
        }
    ], (err, results) => {
        const res1 = results[0];
        const res2 = results[1];

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
            pageTitle: 'Home',
            data: dataChunk,
            country: sortCountry,
            user: req.user
        });
    });
}

