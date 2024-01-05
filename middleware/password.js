const { User } = require('../models/user');
const { createHash } = require('crypto');

async function verifyPassword(req, res, next) {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('user not found');
    
    const password = req.body.password;
    if (!password) res.status(401).send('No password provided');

    try {
        const hash = createHash('sha256').update(password + user.password.salt).digest('hex');
        console.log('created hash:', hash);
        console.log('stored hash:', user.password.hash);
        if (hash === user.password.hash) {
            req.user = user;
            next();
        }
        if (hash !== user.password.hash) res.status(400).send('Invalid Password');
    }

    catch (error) {
        console.error("Error verifying the password:", error.message);
        res.send(500).send('Internal Server Error');
    }
}
module.exports = verifyPassword;