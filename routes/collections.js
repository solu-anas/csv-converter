const { Table } = require('../models/table');
const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
    const table = await Table.findOne({ uuid: req.tableUUID });
    if (!table) res.status(400).send('Table with the given ID was not found');
   
    const mapping = new Map(Array.from(req.mapping));
    const schema = req.schema;

    
});

module.exports = router