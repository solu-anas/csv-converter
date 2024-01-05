const express = require('express');
const verifyToken = require('../middleware/token');
const uploadsController = require('../controllers/upload');
const router = express.Router();
const fields = require('../fields.json');
const multer = require('multer');
const { join, parse } = require('path');
const upload = multer({ dest: join(__dirname, '../tables/') })
const { randomUUID } = require('crypto');
const uuid = randomUUID();
const { parseStream } = require('fast-csv');
const { Readable } = require('stream');
const streamifier = require('streamifier');

// route 1
router.post('/start', verifyToken, upload.single('file'), async (req, res) => {
    console.log(req);
    const fileStream = streamifier.createReadStream(req.file);
    const parser = parseStream(fileStream);
    parser.on('data', data => console.log(data))
    parser.on('end', () => res.send('Parsed Successfully'))
    parser.on('error', (err) => console.error('error:',err.message))
});

// route 2
router.get('/fields', (req, res) => {
    res.json({ fields: fields })
});

module.exports = router;