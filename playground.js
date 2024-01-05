const fs = require('fs');
const csv = require('csv-parser');
const { join } = require('path');
const { pipeline } = require('stream/promises');
const { Writable } = require('stream');
const readline = require('readline');
// process.stdin and process.stdout are both instances of Streams.
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
rl.question('Why should you use streams? ', answer => {
    console.log(`Maybe it's ${answer}, maybe it's because they are awesome! :)`);
    rl.close();
});