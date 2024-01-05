const mongoose = require('mongoose');

module.exports = function () {
    mongoose.connect('mongodb://localhost:27017/csv-converter')
        .then(() => console.log('Connected to mongoDB successfully ...'))
        .catch((err) => console.log(err.message));
};
