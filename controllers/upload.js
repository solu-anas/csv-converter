const { Operation } = require('../models/operation');
const { Table } = require('../models/table');
const { randomUUID } = require('crypto');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const { Transform } = require('stream');

module.exports = async (req, res) => {
    const randomFilename = randomUUID();
    req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        // parse the file stream with fast-csv
        csv.parseStream(file, { headers: true })
            .on('error', (error) => console.error(error))
            .on('data', (row) => {
                // console log each row
                console.log(row)
            })
            .on('end', (count) => {
                // send a response to the client
                res.json({ message: 'File uploaded and processed successfully', count: count });
            })
            // format: tranform the row back to a buffer
            .pipe(csv.format({ headers: true }))
            // format: console log the buffer and continue
            .pipe(new Transform({
                transform(chunk, enc, cb) {
                    console.log(chunk);
                    cb(null, chunk);
                }
            }))
            .pipe(fs.createWriteStream(path.join(__dirname, `../tables/${randomFilename}.csv`)))
            
    })
    req.pipe(req.busboy);
    req.busboy.on('finish', () => {
        // do something after all the data is parsed
    });
}
    
    // // new table entry
    // const table = new Table({
    //     uuid: randomFilename,
    //     owner: req.user._id,
    //     size: req.file.size
    // });
    // await table.save();

    // // new operation (type: "upload") entry
    // const upload = new Operation({
    //     type: "upload",
    //     table: table._id,
    //     user: req.user._id
    // });
    // await upload.save();

    // console.log(`Upload Operation Completed Successfully...\nFrom:\t${table.originalName} (${table.size * 0.001} KB), by ${table.owner}\nto:\t${__dirname + '/' + table.uuid}.csv
    // `)

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
    // return res.send(results[0]);