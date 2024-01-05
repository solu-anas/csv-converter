const express = require('express');
const verifyToken = require('../middleware/token');
const insertsController = require('../controllers/insert');
const undoController = require('../controllers/undo');
const progressController = require('../controllers/progress');
const router = express.Router();

// route 1
router.get('/check-progress', progressController)

// route 2
router.post('/start', verifyToken, insertsController);

// route 3
router.post('/undo', verifyToken, undoController);

module.exports = router;