const { Operation } = require('../models/operation');
const { Table } = require('../models/table');

module.exports = async (req, res) => {
    // new table entry
    const table = new Table({
        uuid: req.file.filename,
        owner: req.user._id,
        originalName: req.file.originalname,
        size: req.file.size
    });
    await table.save();

    // new operation (type: "upload") entry
    const upload = new Operation({
        type: "upload",
        table: table._id,
        user: req.user._id
    });
    await upload.save();

    console.log(`Upload Operation Completed Successfully...\nFrom:\t${table.originalName} (${table.size * 0.001} KB), by ${table.owner}\nto:\t${__dirname + '/' + table.uuid}.csv
    `)

    // sending response
    const pipeline = [
        { $match: { _id: upload._id } },
        {
            $lookup: {
                from: "tables",
                localField: "table",
                foreignField: "_id",
                as: "table"
            }
        },
        { $unwind: "$table" },
        {
            $project: {
                _id: 0,
                "uploadId": "$_id",
                "tableUUID": "$table.uuid"
            }
        },
        { $unwind: "$tableUUID" },
    ];
    const results = await Operation.aggregate(pipeline);
    return res.send(results[0]);
}