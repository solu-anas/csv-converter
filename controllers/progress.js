const { Operation } = require('../models/operation');

module.exports = async (req, res) => {
    const operation = await Operation.findOne({ _id: req.body.operationId });
    if (!operation) return res.status(400).send(`No Such Operation`);

    return res.json({ details: operation.details });
}