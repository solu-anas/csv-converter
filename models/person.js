const { Schema, Types, model } = require('mongoose');

const personSchema = new Schema({
    name: String,
    address: String,
    age: String,
    zipCode: String,
    email: {
        type: String,
        unique: true
    },
    insertId: {
        type: Types.ObjectId
    }
});

const Person = model('Person', personSchema);

module.exports.Person = Person;