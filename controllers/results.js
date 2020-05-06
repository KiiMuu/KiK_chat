const async = require('async');

const Club = require('../models/club');

exports.getResults = (req, res, next) => {
    res.redirect('/clubs');
 }

 exports.postResults = (req, res, next) => {
    async.parallel([
        (cb) => {
            const regex = new RegExp((req.body.country), 'gi');

            Club.find({ '$or': [{'country': regex}, {'name': regex}] }, (err, result) => {
                cb(err, result);
            });
        }
    ], (err, results) => {
        const res1 = results[0];

        const dataChunk = [];
        const chunkSize = 3;

        for (let i = 0; i < res1.length; i += chunkSize) {
            dataChunk.push(res1.slice(i, i + chunkSize));
        }

        res.render('results', {
            pageTitle: 'Filteration Result',
            user: req.user,
            chunks: dataChunk
        });
    });
 }