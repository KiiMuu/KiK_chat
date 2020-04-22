const express = require('express');

const usersController = require('../controllers/users');

const router = express.Router();

// home
router.get('/home', usersController.homePage);
// index
router.get('/', usersController.indexPage);
// sign up
router.get('/signup', usersController.getSignUp);
router.post('/signup', usersController.postSignUp);

module.exports = router;