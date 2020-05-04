const express = require('express');

// controllers
const groupController = require('../controllers/group');

const router = express.Router();

router.get('/group/:name', groupController.groupPage);
router.post('/group/:name', groupController.groupPostPage);

module.exports = router;