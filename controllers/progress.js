const { Operation } = require('../models/operation');

module.exports = async (req, res) => {
    const operation = await Operation.findOne({ _id: req.body.insertId });
    if (!operation) return res.status(400).send(`No Such Operation`);

    return res.json({ details: insert.details });
}