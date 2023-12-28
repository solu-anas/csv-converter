const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { randomBytes } = require('crypto');
dotenv.config();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        salt: {
            type: String,
            default: () => randomBytes(32).toString('hex'),
            required: true
        },
        hash: {
            type: String,
            required: true
        },
    },
    isAdmin: {
        type: Boolean,
        default: true,
        required: true
    },
    token: {
        type: String,
        required: true
    }
});
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, process.env.JWT_PRIVATE_KEY);
};

const User = mongoose.model('User', userSchema);

module.exports.User = User;