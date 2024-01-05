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
    let insert = new Operation({
        type: "insert",
        user: req.user._id,
        table: table._id,
        details: { progress: 0, isProgressEnd: false }
    });
    insert = await insert.save();

    // insertion pipeline
    const reader = fs.createReadStream(join(__dirname, `../tables/${table.uuid}.csv`));
    reader.on('error', (err) => {
        console.error('Reading Error:', err.message);
    });

    const parser = reader.pipe(csv());
    parser.on('error', (err) => {
        console.error('Parsing Error:', err.message);
    });

    parser.pipe(mapRowToDocInsertInDB())
        .on('error', (err) => console.log(err.message));

    // sending the response
    return res.json({ insertionId: insert._id });

    function mapRowToDocInsertInDB() {
        let progress = 0;
        const mapping = new Map(req.body.mapping);
        const transformerOpts = {
            async transform(chunk, enc, cb) {
                const document = mapKeys(chunk, (value, key) => mapping.get(key));
                document.insertId = insert._id;
                const newPerson = new Person(document);
                newPerson
                    .save()
                    .then(() => {
                        return Operation.findByIdAndUpdate(insert._id, { details: { progress: ++progress, isProgressEnd: false } })
                    })
                    .then(() => {
                        console.log(`${progress}: inserted: ${JSON.stringify(document)}`);
                        cb();
                    })
            },
            objectMode: true
        }
        return new Transform(transformerOpts);
    }
}
