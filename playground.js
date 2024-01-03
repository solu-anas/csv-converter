const fs = require('fs');
const csv = require('csv-parser');
const { join } = require('path');

const tableUUID = '09cf2c62-f68b-4c8c-bd73-00be7d43bd85';

const fileLocation = join(__dirname, `./tables/${tableUUID}.csv`);

const reader = fs.createReadStream(fileLocation);

const parser = reader.pipe(csv()); 

parser.on('data', (chunk) => console.log(chunk));