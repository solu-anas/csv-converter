const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function verifyToken(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('No token provided');

    try {
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        req.user = decoded;
        next();
    }
    catch (err) {
        console.error("Token Verification Error:", err.message);
        res.status(400).send('Invalid Token.');
    }
}

module.exports = verifyToken;