const { Schema, Types, model } = require('mongoose');

const uploadSchema = new Schema({
    file: {
        type: Types.ObjectId,
        ref: 'File'
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