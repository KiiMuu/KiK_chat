const express = require('express');

const usersController = require('../controllers/users');

const router = express.Router();

router.get('/', usersController.indexPage);
router.get('/signup', usersController.getSignUp);

module.exports = router;