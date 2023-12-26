const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const verifyPassword = require('../middleware/verifyPassword');
const uploadsPost = require('../controllers/upload');


router.post('/', verifyPassword, uploadsPost);

router.get('/schema', verifyToken, (req, res) => {
    res.json(["name", "address", "age", "zipCode", "email"])
});

module.exports = router;