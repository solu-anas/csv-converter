const express = require('express');
const verifyToken = require('../middleware/token');
const insertsController = require('../controllers/insert');
const undoController = require('../controllers/undo');
const progressController = require('../controllers/progress');
const router = express.Router();

// Start Insertion of file into DB
router.post('/start', verifyToken, insertsController);

// Check Progress while Insertion
router.get('/check-progress', progressController)

// Undo Insertion
router.post('/undo', verifyToken, undoController);

module.exports = router;