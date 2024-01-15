const express = require('express');
const uploadsRouter = require('../routes/uploads');
const usersRouter = require('../routes/users');
const insertsRouter = require('../routes/inserts');

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/uploads', uploadsRouter);
    app.use('/api/users', usersRouter);
    app.use('/api/inserts', insertsRouter);
};