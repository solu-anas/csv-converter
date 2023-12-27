const { Schema, Types, model } = require('mongoose');



const fileSchema = new Schema({
    originalName: {
        type: String
    },
    uuid: {
        type: Types.UUID,
        required: true
    },
    owner: {
        type: Types.ObjectId,
        ref: 'User'
    },
    size: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isProcessed: {
        type: Boolean,
        default: false
    }
});

const File = model('File', fileSchema);

module.exports.File = File;