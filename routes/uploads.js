const { join } = require('path');
const { randomUUID } = require('crypto');
const express = require('express');
const multer = require('multer');
const verifyToken = require('../middleware/verifyToken');
const uploadsController = require('../controllers/upload');
const router = express.Router();

// Configuring multer for uploads
const storage = multer.diskStorage({
    destination: join(__dirname, '../tables/'),
    filename: (req, file, cb) => {
        const uuid = randomUUID();
        cb(null, uuid + '.csv')
    }
});

const upload = multer({ storage: storage });

// route 1
router.post('/', verifyToken, upload.single('file'), uploadsController);

// route 2
router.get('/schema', verifyToken, (req, res) => {
    res.json(["name", "address", "age", "zipCode", "email"])
});

module.exports = router;