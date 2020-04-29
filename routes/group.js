const express = require('express');

// controllers
const groupController = require('../controllers/group');

const router = express.Router();

router.get('/group/:name', groupController.groupPage);

module.exports = router;