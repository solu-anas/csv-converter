const { Table } = require('../models/table');
const { Operation } = require('../models/operation');
const { Person } = require('../models/person');
const { Transform } = require('stream');
const fs = require('fs');
const { join } = require('path');
const { mapKeys } = require('lodash');
const csv = require('csv-parser');


module.exports = async (req, res) => {
    const table = await Table.findOne({ uuid: req.body.tableUUID });
    if (!table) return res.status(404).send('Table Not Found');


    // new operation (type: "insert") entry
    const insertOp = new Operation({
        type: "insert",
        user: req.user._id,
        table: table._id,
        details: { progress: 0, isProgressEnd: false }
    });
    await insertOp.save();

    const mapping = new Map(req.body.mapping);
    const reader = fs.createReadStream(join(__dirname, `../tables/${table.uuid}.csv`));
    const parser = reader.pipe(csv());
    
    const transformer = parser.pipe(insert(insertOp, mapping));
    
    return res.json({ details: insertOp.details });
}


async function insert(insertOp, mapping) {
    return new Transform(async (chunk, enc, cb) => {
        let progress = 0;
        const document = mapKeys(chunk, (value, key) => mapping.get(key));
        const newPeople = new Person(document);
        await newPeople.save();
        await Operation.findByIdAndUpdate(insertOp._id, { details: { progress: ++progress } });
        cb();
    })
}
