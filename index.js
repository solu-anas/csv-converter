const app = require("express")();
const dotenv = require('dotenv');
dotenv.config();

require('./startup/routes')(app);
require('./startup/db')();

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`Listening to port ${port} ...`);
});

module.exports = server;