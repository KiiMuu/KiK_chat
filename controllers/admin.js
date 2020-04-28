const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

const Club = require('../models/club');

exports.adminPage = (req, res, next) => {
    res.render('admin/dashboard', {
        pageTitle: 'Dashborad'
    });
}

exports.uploadFile = (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../public/uploads');

    form.on('file', (field, file) => {
        fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
            if (err) throw err;

            console.log('File renamed successfully');
        });
    });

    form.on('error', (err) => {
        console.log(err);
    });

    form.on('end', () => {
        console.log('File uploaded successfully');
    });

    form.parse(req);
}

exports.adminPostPage = (req, res, next) => {
    const newClub = new Club({
        name: req.body.club,
        country: req.body.country,
        image: req.body.upload
    });

    newClub.save((err) => {
        res.render('admin/dashboard')
    });
}