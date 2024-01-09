const { join } = require('path');
const { randomUUID } = require('crypto');
const { parseStream, format, writeToPath, parse, writeToStream, writeToBuffer } = require('fast-csv');
const { Table } = require('../models/table');
const { Operation } = require('../models/operation');
const { Transform, pipeline, finished } = require('stream');
const { EOL } = require('os');
const fs = require('fs');
const { chunk } = require('lodash');

module.exports = async (req, res) => {
    // create new table and operation entry
    req.busboy.on('file', (name, file, info) => {
        // Creating the Entries in DB
        const randomFilename = randomUUID();
        const path = join(__dirname, `../tables/${randomFilename}.csv`);

        const table = new Table({
            originalName: info.filename,
            uuid: randomFilename,
            owner: req.user._id,
            // size: req.file.size
        });
        table.save().then((savedTable) => {
            const upload = new Operation({
                type: "upload",
                table: table._id,
                user: req.user._id,
                details: {
                    isProgressEnd: false,
                    progress: null
                }
            });
            upload.save().then((savedUpload) => {
                const parser = file.pipe(parse({ headers: true }));
                parser.on('end', (rowCount) => {
                    Table.findByIdAndUpdate(savedTable._id, { rowCount: rowCount }).then(() => { console.log(`Parsing: Parsed ${rowCount} Rows!`) })
                });
                const formatter = format();
                const writer = writerAndMonitor(savedTable._id, savedUpload._id, path);

                const pipeline = parser.pipe(formatter).pipe(writer);
                pipeline.on('error', () => console.error('Upload Pipeline Error:', err.message));
                pipeline.on('finish', () => {
                    Operation.findByIdAndUpdate(savedUpload._id, { $set: { 'details.isProgressEnd': true } })
                        .then((finishedUpload) => console.log('Upload Pipeline Finished!'))
                });
            });
        })
    })

    req.busboy.on('finish', () => {
        // do something after all the data is parsed
        res.send('Upload Successful');
    });

    req.pipe(req.busboy);

};

function writerAndMonitor(tableId, uploadId, path) {
    let progress = 0;
    let fileSize = 0;
    const destination = fs.createWriteStream(path);
 
    return new Transform({
        transform(chunk, enc, cb) {
            // Check if the destination stream is ready to receive more data
            if (!destination.write(chunk)) {
                // If not, wait until it's ready
                destination.once('drain', () => {
                   this.push(chunk);
                   cb();
                });
            } else {
                // If it is ready, push the chunk and continue
                this.push(chunk);
                cb();
            }
 
            // Update fileSize and progress
            fileSize += chunk.length;
            ++progress;
            console.log(chunk.toString());
 
            // Update progress in Operation collection
            Operation.findByIdAndUpdate(uploadId, { $set: { 'details.progress': progress } })
                .then(() => {
                   Table.findByIdAndUpdate(tableId, { size: fileSize })
                       .then(() => {
                           cb(null, chunk);
                       })
                })
        }
    });
 }
 

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