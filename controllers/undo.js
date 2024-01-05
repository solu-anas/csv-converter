const { Operation } = require('../models/operation');
const { Person } = require('../models/person');


module.exports = async (req, res) => {
    const insert = await Operation.findById(req.body.insertId);
    if (!insert) return res.status(400).send("No Such Insert");

    let undoOp = new Operation({
        type: 'undo',
        user: req.user._id,
        details: {
            undoneInsertId: insert._id,
        }
    });

    undoOp.save().then(() => {
        res.send('Started Undoing Insertion ...')
        deleteNext(insert._id);
    })}

function deleteNext(insertId) {
    Person.findOneAndDelete({ insertId: insertId })
        .then(async () => {
            const check = await Person.findOne({ insertId: insertId });
            if (check) deleteNext(insertId);
        })
}