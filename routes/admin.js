const express = require('express');

// controllers
const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/dashboard', adminController.adminPage);

router.post('/uploadFile', adminController.uploadFile);
router.post('/dashboard', adminController.adminPostPage);

module.exports = router;