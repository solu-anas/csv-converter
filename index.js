const express = require('express');
const config = require('config')
const app = express();

require('./startup/routes')(app);
require('./startup/db')();

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`Listening to port ${port} ...`);
});

module.exports = server;