const { createHash } = require('crypto');
const express = require('express');
const verifyPassword = require('../middleware/password');
const verifyToken = require('../middleware/token');
const router = express.Router();
const { User } = require('../models/user');

router.get('/me', verifyPassword, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password -token');
    res.send(user);
});

router.get('/dashboard', verifyToken, (req, res) => {
    res.send('Hoorray');
});

router.get('/all', verifyPassword, async (req, res) => {
    const users = await User.find().select('-password -token').sort('name');
    res.json({ users: users });
});

router.get('/login', verifyPassword, async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json({ token: user.token });
});

router.post('/create', async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = new User({
        name: req.body.name,
        email: req.body.email,
    });

    user.password.hash = user.generateHash(req.body.password, user.password.salt);
    user.token = user.generateAuthToken();

    user.save()
        .then(() => {
            res.send('created user successfully!');
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('User Creation Error');
        });
});

module.exports = router;