const express = require('express');
const uploadsRouter = require('../routes/uploads');
const usersRouter = require('../routes/users');
const testRouter = require('../routes/test');
const insertsRouter = require('../routes/inserts');
const errorHandler = require('../middleware/error');

module.exports = function(app) {
    app.set('view engine', 'pug');
    app.use(express.json());
    app.use('/api/uploads', uploadsRouter);
    app.use('/api/users', usersRouter);
    app.use('/api/inserts', insertsRouter);
    app.use('/', testRouter);
    app.get('/', errorHandler);
};