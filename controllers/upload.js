const { join } = require('path');
const { randomUUID } = require('crypto');
const { parseStream, format } = require('fast-csv');
const { Table } = require('../models/table');
const { Operation } = require('../models/operation');
const { Transform, pipeline } = require('stream');
const fs = require('fs');

module.exports = async (req, res) => {
    // create new table and operation entry
    req.busboy.on('file', (name, file, info) => {
        // Creating the Entries in DB
        const randomFilename = randomUUID();
        const table = new Table({
            originalName: info.filename,
            uuid: randomFilename,
            owner: req.user._id,
            // size: req.file.size
        });
        table.save().then((table) => {
            console.log('Created new Entry to Tables DB')
            const upload = new Operation({
                type: "upload",
                table: table._id,
                user: req.user._id,
                details: {
                    isProgressEnd: false
                }
            });
            upload.save().then(() => {
                console.log('Created new Entry to Operations DB ...')
            });
        })
        
        // Parsing the .csv file
        const parser = parseStream(file, { headers: true });
        parser.on('data', (data) => {
            // TODO: track parsing progress
            console.log(typeof data);
        })
        parser.on('end', (rowCount) => {
            table.rowCount = rowCount;
            // console.log(`Parsed ${rowCount} Rows`);
        });
        parser.on('error', (err) => console.error('Parsing Error:', err.message));

        // Formatting the .csv file
        const formatter = parser.pipe(format({ headers: true }))
        formatter.on('error', (err) => console.error('Formatting Error:', err.message))

        // Writing the .csv file to the filesystem
        const writer = formatter.pipe(fs.createWriteStream(join(__dirname, `../tables/${randomFilename}.csv`)));
        writer.on('data', (data) => {
            // track the writing progress
            
        })

    })

    req.busboy.on('finish', () => {
        // do something after all the data is parsed
        res.send('Upload Successful');
    });

    req.pipe(req.busboy);

};


// // sending response
// const pipeline = [
//     { $match: { _id: upload._id } },
//     {
//         $lookup: {
//             from: "tables",
//             localField: "table",
//             foreignField: "_id",
//             as: "table"
//         }
//     },
//     { $unwind: "$table" },
//     {
//         $project: {
//             _id: 0,
//             "uploadId": "$_id",
//             "tableUUID": "$table.uuid"
//         }
//     },
//     { $unwind: "$tableUUID" },
// ];
// const results = await Operation.aggregate(pipeline);
// res.send(results[0]);