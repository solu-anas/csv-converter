const { Table } = require('../models/table');
const { Operation } = require('../models/operation');
const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const insertsController = require('../controllers/insert');
const router = express.Router();

// route 1
router.get('/check-progress', async (req, res) => {
    const table = await Table.findOne({ uuid: req.body.tableUUID });
    if (!table) res.status(404).send("Table not found");

    Operation.findOne({ table: table._id, type: "insert" })
        .then((operation) => res.json({ details: operation.details.progress }))
        .catch((err) => {
            console.error("Operation Query Error:", err.message)
            res.status(400).send("Operation Query Error");
        })
})


// route 2
router.post('/start', verifyToken, insertsController);

module.exports = router;