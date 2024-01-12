const app = require("express")();
const dotenv = require('dotenv');
dotenv.config();

require('./startup/routes')(app);
require('./startup/db')();

const port = 5050;
const server = app.listen(port, () => {
    console.log(`Listening to port ${port} ...`);
});

module.exports = server;