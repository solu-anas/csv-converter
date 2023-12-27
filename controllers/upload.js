const { Upload } = require('../models/upload');
const { Table } = require('../models/table');

module.exports = (req, res) => {
    // new entry in Tables collection
    const table = new Table();
    table.uuid = req.file.filename;
    table.owner = req.user._id;
    table.originalName = req.file.originalname;
    table.size = req.file.size;
    table.save().then((uploadedTable) => {
        // new entry in uploads collection
        const upload = new Upload({
            table: uploadedTable._id,
            user: req.user._id
        });
        upload
            .save()
            .then(() => {
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
                Upload
                    .aggregate(pipeline)
                    .then((results) => res.send(results[0]))
                    .catch((err) => console.error('Aggregation Error:', err.message))
            });
    });
};