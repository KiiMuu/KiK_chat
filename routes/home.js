const express = require('express');

// controllers
const homeController = require('../controllers/home');

const router = express.Router();

router.get('/', homeController.homePage);

module.exports = router;