const { createHash } = require('crypto');
const express = require('express');
const verifyPassword = require('../middleware/verifyPassword');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();
const { User } = require('../models/user');

router.get('/me', verifyPassword, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.get('/dashboard', verifyToken, (req, res) => {
    // TODO
});

router.get('/all', verifyPassword, async (req, res) => {
    const users = await User.find().select('-password').sort('name');
    res.json({ users: users });
});

router.get('/login', verifyPassword, async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json({ token: token });
});

router.post('/', async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = new User({
        name: req.body.name,
        email: req.body.email,
    });

    user.password.hash = createHash('sha256').update(req.body.password + user.password.salt).digest('hex');
    user.save();
    res.header('x-auth-token', user.generateAuthToken()).send('created user successfully!');
});

module.exports = router;