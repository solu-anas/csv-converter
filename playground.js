const fs = require('fs');
const csv = require('csv-parser');
const { join } = require('path');
const { pipeline } = require('stream/promises');
const { Transform } = require('stream');

const transformer = new Transform();
console.log(transformer.closed);