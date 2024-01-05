const express = require('express');
const verifyToken = require('../middleware/token');
const uploadsController = require('../controllers/upload');
const router = express.Router();
const fields = require('../fields.json');
const busboy = require('connect-busboy');

// configure connect-busboy options
router.use(busboy({
    highWaterMark: 2 * 1024 * 1024, // 2MiB buffer
    // limits: {
    //     fileSize: 10 * 1024 * 1024 // 10MiB limit
    // }
}));

// route 1
router.post('/start', verifyToken, uploadsController);

// route 2
router.get('/fields', (req, res) => {
    res.json({ fields: fields })
});

module.exports = router;