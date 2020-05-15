const express = require('express');

// controllers
const privateChatController = require('../controllers/privatechat');

const router = express.Router();

router.get('/chat/:name', privateChatController.getChatPage);

module.exports = router;