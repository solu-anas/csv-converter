const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { User } = require('../models/user')
dotenv.config();

function verifyToken(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('No token provided');

    const { _id } = getJWTPayload(token);
    User.findById(_id)
        .then((user) => {
            req.user = jwt.verify(token, user.password.hash);
            next();
        })
        .catch((err) => {
            console.error("Token Verification Error:", err.message);
            return res.status(401).send('Verification Error: Invalid Token')
        })
}

function getJWTPayload(token) {
    return JSON.parse((Buffer.from(token.split('.')[1], 'base64')));
}

module.exports = verifyToken;