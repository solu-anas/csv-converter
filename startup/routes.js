const express = require('express');
const uploadsRouter = require('../routes/uploads');
const filesRouter = require('../routes/files');
const usersRouter = require('../routes/users');
const mappingsRouter = require('../routes/mappings');
const testRouter = require('../routes/test');

module.exports = function(app) {
    app.set('view engine', 'pug')
    app.use(express.json());
    app.use('/api/uploads', uploadsRouter);
    app.use('/api/files', filesRouter);
    app.use('/api/users', usersRouter);
    app.use('/api/mappings', mappingsRouter);
    app.use('/', testRouter);
};