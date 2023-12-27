const { Upload } = require('../models/upload');
const { File } = require('../models/file');

module.exports = (req, res) => {
    // new entry in files collection
    const file = new File();
    file.originalName = req.file.originalname;
    file.size = req.file.size;
    file.uuid = req.file.filename;
    file.save().then((uploadedFile) => {
        // new entry in uploads collection
        const upload = new Upload({
            file: uploadedFile._id,
            user: req.user._id
        });
        upload
            .save()
            .then(() => {
                const pipeline = [
                    { $match: { _id: upload._id } },
                    {
                        $lookup: {
                            from: "files",
                            localField: "file",
                            foreignField: "_id",
                            as: "file"
                        }
                    },
                    { $unwind: "$file" },
                    {
                        $project: {
                            _id: 0,
                            "uploadId": "$_id",
                            "fileUUID": "$file.uuid"
                        }
                    },
                    { $unwind: "$fileUUID" },
                ];
                Upload
                    .aggregate(pipeline)
                    .then((results) => res.send(results[0]))
                    .catch((err) => console.error('Aggregation Error:', err.message))
            });
    });
};