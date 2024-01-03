const fs = require('fs');
const csv = require('csv-parser');
const { join } = require('path');
const through2 = require('through2')

const tableUUID = 'a5f4c313-98b4-45d8-9270-09f6dcc47fc4';

const fileLocation = join(__dirname, `./tables/${tableUUID}.csv`);

const reader = fs.createReadStream(fileLocation);

const parser = reader.pipe(csv()); 

parser.pipe(through2.obj((chunk, enc, cb) => {
    console.log(chunk);
    cb();
}))