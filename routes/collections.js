const { Table } = require('../models/table');
const { parse } = require('papaparse');
const { readFileSync } = require('fs');
const { join } = require('path');
const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
    const table = await Table.findOne({ uuid: req.body.tableUUID });
    if (!table) return res.status(400).send('Table with the given UUID was not found');


    const mapping = new Map(Array.from(req.body.mapping));
    const schema = req.body.schema;

    // reading file from filesystem
    const fileLocation = join(__dirname, `../tables/${table.uuid}.csv`);
    let csv;
    try {
        csv = readFileSync(fileLocation, 'utf8');
    }
    catch (err) {
        console.error("Reading Table Error:", err.message)
        return res.status(500).send("Internal Server Error");
    }

    // parsing the csv file
    const { errors } = parse(csv);
    if (errors) return res.status(500).send(errors.message)
    
    // 
    return res.send('testing data');
});

module.exports = router