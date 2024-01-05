const { Table } = require('../models/table');
const { Operation } = require('../models/operation');
const { Person } = require('../models/person');
const { Transform } = require('stream');
const fs = require('fs');
const { join } = require('path');
const { mapKeys } = require('lodash');
const csv = require('csv-parser');


module.exports = async (req, res) => {
    // find table
    let table;
    try {
        table = await Table.findOne({ uuid: req.body.tableUUID });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).send('Table Lookup Error');
    }

    // new operation (type: "insert") entry
    let insertOp = new Operation({
        type: "insert",
        user: req.user._id,
        table: table._id,
        details: { progress: 0, isProgressEnd: false }
    });
    await insertOp.save();

    // insertion pipeline
    const reader = fs.createReadStream(join(__dirname, `../tables/${table.uuid}.csv`));
    reader.on('error', (err) => {
        console.error('Reading Error:', err.message);
    });

    const parser = reader.pipe(csv());
    parser.on('error', (err) => {
        console.error('Parsing Error:', err.message);
    });

    parser.pipe(mapRow2DocinsertInDB())
        .on('error', (err) => console.log(err.message));

    // sending the response
    return res.send('Insertion Started Successfully');

    function mapRow2DocinsertInDB() {
        let progress = 0;
        const mapping = new Map(req.body.mapping);
        const transformerOpts = {
            async transform(chunk, enc, cb) {
                const document = mapKeys(chunk, (value, key) => mapping.get(key));
                const newPeople = new Person(document);
                await newPeople.save();
                await Operation.findByIdAndUpdate(insertOp._id, { details: { progress: ++progress, isProgressEnd: false } });
                console.log(`${progress}: inserted: ${document}`);
                cb();
            },
            objectMode: true
        }
        return new Transform(transformerOpts);
    }
}
