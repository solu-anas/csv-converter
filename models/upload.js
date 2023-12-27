const { Schema, Types, model } = require('mongoose');

const uploadSchema = new Schema({
    table: {
        type: Types.ObjectId,
        ref: 'Table'
    },
    user: {
        type: Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Upload = model('Upload', uploadSchema);

module.exports.Upload = Upload;