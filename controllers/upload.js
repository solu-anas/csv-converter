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
                    Table.findByIdAndUpdate(savedTable._id, { rowCount: rowCount })
                    //.then(() => { console.log(`Parsing: Parsed ${rowCount} Rows!`) })
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

    const writeStream = fs.createWriteStream(path);

    return new Transform({
        transform(chunk, enc, next) {
            const canWrite = writeStream.write(chunk);
            console.log(chunk);
            // can write
            // monitor and next
            if (canWrite) {
                monitor(tableId, uploadId, chunk)
                next();
            }

            // cannot write
            // wait for drain
            // then monitor and next
            else {
                writeStream.on("drain", () => {
                    monitor(tableId, uploadId, chunk)
                    next();
                })
            }
        }
    });
}

let progress = 0;
let fileSize = 0;

function monitor(tableId, uploadId, chunk) {
    fileSize += chunk.length;
    ++progress;

    // Update progress in Operation collection
    Operation.findByIdAndUpdate(uploadId, { $set: { 'details.progress': progress } })
        .then(() => { Table.findByIdAndUpdate(tableId, { size: fileSize }); })
}