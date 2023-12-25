const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {

    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: true,
        required: true
    }
});
userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
};


const User = mongoose.model('User', userSchema);
module.exports.User = User;