const { Table } = require('../models/table');
const { Operation } = require('../models/operation');
const { Person } = require('../models/person');
const { Transform, pipeline } = require('stream');
const fs = require('fs');
const { join } = require('path');
const { mapKeys } = require('lodash');
const csv = require('csv-parser');
const { parse } = require('fast-csv');


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
    const parser = reader.pipe(parse());
    parser.on('data', row => console.log(row))
    parser.on('end', rowCount => console.log(rowCount));
    
    const mapper = mapRowToDoc();
    const inserter = insertInDB();
    
    // pipeline(reader, parser, mapper, inserter, (err) => {
    //     if (err) {
    //         console.error('Pipeline failed.', err);
    //         res.send(`Error: ${err.message}`);
    //     } else {
    //         console.log('Pipeline succeeded.');
    //         return res.json({ insertionId: insert._id });
    //     }
    // });

    function mapRowToDoc() {
        const mapping = new Map(req.body.mapping);
        const transformerOpts = {
            transform(chunk, enc, cb) {
                const document = mapKeys(chunk, (value, key) => mapping.get(key));
                document.insertId = insert._id;
                cb(null, document);
            },
            objectMode: true
        }
        return new Transform(transformerOpts);
    }

    function insertInDB() {
        let progress = 0;
        const transformerOpts = {
            async transform(document, enc, cb) {
                document.insertId = insert._id;
                if (await Person.findOne({ email: document.email })) {
                    return cb();
                };
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