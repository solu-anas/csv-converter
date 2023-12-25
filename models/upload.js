const { Schema, Types, model } = require('mongoose');

const uploadSchema = new Schema({
    uploadedFile: {
        type: Types.ObjectId,
        ref: 'File'
    },
    uploadedBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

const Upload = model('Upload', uploadSchema);

module.exports.Upload = Upload;