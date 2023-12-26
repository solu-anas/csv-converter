const { Form } = require('multiparty');
const { File } = require('../models/file');
const { Upload } = require('../models/upload');
const fs = require('fs');


module.exports = async (req, res) => {
    let form = new Form();
    let upload;

    form.on('close', () => {
        Upload
            .aggregate([
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
            ])
            .exec((err, results) => {
                if (err) {
                    console.error('Error:', err);
                } else {
                    res.send(results[0]);
                }
            })

    });

    form.on('error', (err) => console.log("error:", err.message));

    // form.on('part', (part) => {
    //     if (!part.filename) return part.resume();

    //     if ((part.filename) && (part.name === 'file')) {
    //         // TBD
    //     }
    // });
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.status(400).send('Error parsing form data');
            return;
        }

        // Handle form fields
        console.log('Fields:', fields);

        // Handle files
        console.log('Files:', files);

        // Create a new file entry in db

        // const file = new File();
        // file.name = part.filename;
        // file.size = 0;
        // part.on('data', (buf) => {
        //     file.size += buf.length
        // });
        // part.pipe(fs.createWriteStream(`./files/${file.uuid}.csv`));
        // file.save().then((uploadedFile) => {
        //     // Create a new upload entry in db

        //     const upload = new Upload({
        //         file: uploadedFile._id,
        //         user: user._id
        //     });
        //     upload.save();
        // });

        // Send response
        res.status(200).send('Form data received');
    });
};