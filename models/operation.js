const { Schema, Types, model } = require('mongoose');

const operationSchema = new Schema({
    type: {
        type: String,
        enum: ['upload', 'insert', 'undo']
    },
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
    },
    details: {
        type: Object,
        default: null
    }
});

const Operation = model('Operation', operationSchema);

module.exports.Operation = Operation;