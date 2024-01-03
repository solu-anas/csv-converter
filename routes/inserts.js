const { Table } = require('../models/table');
const { Person } = require('../models/person');
const { Operation } = require('../models/operation');
const { join } = require('path');
const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();
const fs = require('fs');
const { finished } = require('stream/promises');
const { parse } = require('csv-parse');
const csv = require('csv-parser');
const _ = require('lodash');
const through2 = require('through2');

router.get('/check-progress', async (req, res) => {
    const table = await Table.findOne({ uuid: req.body.tableUUID });
    if (!table) {
        res.status(404).send("table not found");
    }


    Operation.findOne({ table: table._id, type: "insert" })
        .then((operation) => {
            res.json({details: operation.details})
            //res.json({ ...(operation.details) })
        })
        .catch((err) => {
            console.error("Operation Query Error:", err.message)
            res.status(400).send("Operation Query Error");
        })
})

router.post('/start', verifyToken, async (req, res) => {

    Table
        .findOne({ uuid: req.body.tableUUID })
        .then(async (table) => {
            const insert = new Operation({
                type: "insert",
                user: req.user._id,
                table: table._id,
                details: {
                    progress: 0,
                    isProgressEnd: false
                }
            });
            insert
                .save()
                .then((savedInsert) => {
                    const mapping = new Map(req.body.mapping);
                    let progressCounter = 0;
                    const fields = require('../fields.json');
                    const fileLocation = join(__dirname, `../tables/${table.uuid}.csv`);
                    // const parser = fs.createReadStream(fileLocation).pipe(parse());

                    const results = [];

                    const parser = fs.createReadStream(fileLocation).pipe(csv());

                    let buffer = [];
                    const bufferSize = 100;

                    parser
                        .pipe(through2.obj((chunk, enc, cb) => {
                            const document = _.mapKeys(chunk, (value, key) => mapping.get(key));
                            // buffer.push(document);
                            // if (buffer.length < bufferSize) cb();
                            // else {
                            //     // empty the buffer
                            //     buffer = [];
                            //     cb();
                            // }

                            console.log(document);
                            (new Person(document))
                                .save()
                                .then(() => {
                                    Operation.findByIdAndUpdate(savedInsert._id, {
                                        details: { progress: ++progressCounter }
                                    })
                                        .then(() => cb())
                                        .catch((err) => {
                                            console.error("Insertion Error:", err.message)
                                            return res.status(500).json({ Error: err.message })
                                        })
                                })
                                .catch((err) => {
                                    console.error("Insertion Error:", err.message)
                                    return res.status(500).json({ Error: err.message })
                                })
                        }))

                        .on('error', (err) => console.error('Error:', err.message))

                        .on('finish', () => {

                            return res.json({ newlyAdded: results.length })
                            //     Operation.findByIdAndUpdate(savedInsert._id, {
                            //         details: { isProgressEnd: true }
                            //     }).catch((err) => {
                            //         console.error("Insertion Error:", err.message)
                            //         return res.status(500).json({ Error: err.message })
                        })

                    // })
                    // .on('error', (err) => {
                    //     console.error(`Error: ${err}`);
                    //     return res.status(500).json({ Error: err.message })
                    // });
                })
                .catch((err) => {
                    console.log("Insertion Error:", err.message)
                    return res.status(500).json({ Error: err.message })
                });

        })
})

module.exports = router