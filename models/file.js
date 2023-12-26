const { Schema, Types, model } = require('mongoose');
const { randomUUID } = require('crypto');


const fileSchema = new Schema({
    name: {
        type: String
    },
    uuid: {
        type: Types.UUID,
        default: () => randomUUID()
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