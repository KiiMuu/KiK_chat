const express = require('express');

// controllers
const privateChatController = require('../controllers/privatechat');

const router = express.Router();

router.get('/chat/:name', privateChatController.getChatPage);
router.post('/chat/:name', privateChatController.postChatPage);

module.exports = router;