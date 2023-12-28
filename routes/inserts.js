const { Table } = require('../models/table');
const { Person } = require('../models/person');
const { Operation } = require('../models/operation');
const { join } = require('path');
const readline = require('readline');
const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const fields = require('../fields.json');
const router = express.Router();

const fs = require('fs');
const csv = require('csv-parser');

router.get('/check-progress', async (req, res) => {
    const table = await Table.findOne({ uuid: req.body.tableUUID });

    if (!table) {
        res.status(404).send("table not found");
    }

    Operation.findOne({ table: table._id, type: "insert" })
        .then((operation) => {
            res.send('woohoo')
            //res.json({ ...(operation.details) })
        })
        .catch((err) => {
            console.error("Operation Query Error:", err.message)
            res.status(400).send("Operation Query Error");
        })
})

router.post('/start', verifyToken, async (req, res) => {

    Table.findOne({ uuid: req.body.tableUUID }).then(async (table) => {
        const insert = new Operation({
            type: "insert",
            user: req.user._id,
            table: table._id,
            details: {
                progress: 0,
                isProgressEnd: false
            }
        });
        insert.save()
            .then((savedInsert) => {
                const mapping = new Map(req.body.mapping);
                let progressCounter = 0;
                res.send('started')
                const fileLocation = join(__dirname, `../tables/${table.uuid}.csv`);
                const readInterface = readline.createInterface({
                    input: fs.createReadStream(fileLocation),
                    output: process.stdout,
                    console: false
                });
                readInterface
                    .on('line', (line) => {
                        line.pipe(csv())
                            .on('data', (row) => {
                                // Computation
                                let document;
                                try {
                                    document = fields.reduce((doc, field) => {
                                        doc[field] = row[mapping.get(field)]
                                        return doc;
                                    }, {});
                                    console.log(document);
                                }
                                catch (err) {
                                    console.error("Insertion Error:", err.message)
                                }
                                (new Person(document)).save()
                                    .then(() => {
                                        Operation.findByIdAndUpdate(savedInsert._id, {
                                            details: { progress: ++progressCounter }
                                        }).catch((err) => { console.error("Insertion Error:", err.message) })
                                    })
                                    .catch((err) => console.error("Insertion Error:", err.message))
                            })

                    })
                    .on('close', () => {
                        Operation.findByIdAndUpdate(savedInsert._id, {
                            details: { isProgressEnd: true }
                        }).catch((err) => { console.error("Insertion Error:", err.message) })

                    })
                    .on('error', (err) => {
                        console.error(`Error: ${err}`);
                    });
            })
            .catch((err) => { console.log("Insertion Error:", err.message) });

    })
})

module.exports = router