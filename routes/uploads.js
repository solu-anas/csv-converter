const express = require('express');
const router = express.Router();
const { Form } = require('multiparty');
const { File } = require('../models/file');
const { Upload } = require('../models/upload');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    // authentication
    //...
    // authorization
    //...
    // Input Validation
    //...

    // logged in, authorized, and valid
    let form = new Form();
    let file;
    let report;
    const user = req.user;

    form.on('close', () => {
        res.send("Success, Uploaded: ", report);
    });

    form.on('error', (err) => console.error("error:", err.message));

    form.on('part', async (part) => {
        if (!part.filename) return part.resume();

        if ((part.filename) && (part.name === 'file')) {
            // Create a new file entry in db
            file = new File();

            file.name = part.filename;

            file.size = 0;
            part.on('data', (buf) => file.size += buf.length);
            await file.save();

            // Download content to filesystem in server
            const csvPath = `./files/${file.uuid}.csv`;
            await part.pipe(fs.createWriteStream(csvPath));
            console.log('success, downloaded to filesystem');

            // Create a new upload entry in db
            report = new Upload({
                uploadedFile: file._id,
                uploadedBy: user._id
            });
            await report.save();
            part.resume();
        }
    });

    form.parse(req);
});

module.exports = router;