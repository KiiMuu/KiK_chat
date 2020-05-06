const express = require('express');

// controllers
const homeController = require('../controllers/home');

const router = express.Router();

router.get('/', homeController.indexPage);
router.get('/clubs', homeController.homePage);

router.post('/clubs', homeController.postHomePage);

// logout
router.get('/logout', homeController.logout);


module.exports = router;