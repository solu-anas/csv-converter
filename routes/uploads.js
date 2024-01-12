const busboy = require('connect-busboy');
const verifyToken = require('../middleware/token');
const express = require('express');
const router = express.Router();
const uploadsController = require('../controllers/upload');
const progressController = require('../controllers/progress');

// configure connect-busboy options
router.use(busboy({
    highWaterMark: 1024,
    // limits: {
    //     fileSize: 10 * 1024 * 1024 // 10MiB limit
    // }
}));

// Upload a .csv file
router.post('/start', verifyToken, uploadsController);

// Check Progress while uploading
router.get('/check-progress', progressController);

module.exports = router;