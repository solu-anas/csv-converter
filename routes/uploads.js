const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/uploadFile');
const uploadsController = require('../controllers/upload');
const router = express.Router();
const fields = require('../fields.json');


// route 1
router.post('/start', verifyToken, upload('file'), uploadsController);

// route 2
router.get('/fields', (req, res) => {
    res.json({ fields: fields })
});

module.exports = router;