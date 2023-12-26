const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const { User } = require('../models/user');

// Getting the current user
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

// Getting the list of all users after auth is successful
router.get('/all', auth, async (req, res) => {
    const users = await User.find().select('-password').sort('name');
    res.send(users);
});

// Register a new user
router.post('/', async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();
    console.log(token);
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;