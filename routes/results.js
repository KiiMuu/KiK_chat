const express = require('express');

// controllers
const resultsController = require('../controllers/results');

const router = express.Router();

router.get('/results', resultsController.getResults);
router.post('/results', resultsController.postResults);

module.exports = router;