const { Schema, Types, model } = require('mongoose');

const tableSchema = new Schema({
    originalName: {
        type: String
    },
    uuid: {
        type: Types.UUID,
        required: true
    },
    rowCount: {
        type: Number
    },
    owner: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    size: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Table = model('Table', tableSchema);

module.exports.Table = Table;