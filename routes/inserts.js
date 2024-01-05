const { Operation } = require('../models/operation');
const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const insertsController = require('../controllers/insert');
const undoController = require('../controllers/undo');
const router = express.Router();

// route 1
router.get('/check-progress', async (req, res) => {
    const insert = await Operation.findOne({ _id: req.body.insertId });
    if (!insert) return res.status(400).send("No Such Insert");

    return res.json({ details: insert.details });
})


// route 2
router.post('/start', verifyToken, insertsController);

// route 3
router.post('/undo', verifyToken, undoController);

module.exports = router;