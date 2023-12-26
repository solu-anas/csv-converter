const express = require('express');
const router = express.Router();
const { Form } = require('multiparty');
const { File } = require('../models/file');
const { Upload } = require('../models/upload');
const fs = require('fs');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    let form = new Form();
    let file;
    let upload;
    const user = req.user;

    form.on('close', async () => {
        res.send(upload);
    });

    form.on('error', (err) => console.log("error:", err.message));

    form.on('part', async (part) => {
        if (!part.filename) return part.resume();

        if ((part.filename) && (part.name === 'file')) {
            // Create a new file entry in db
            file = new File();
            file.name = part.filename;
            file.size = 0;
            part.on('data', (buf) => {
                file.size += buf.length
            });
            part.pipe(fs.createWriteStream(`./files/${file.uuid}.csv`));
            await file.save();

            // Create a new upload entry in db
            upload = new Upload({
                file: file._id,
                user: user._id
            });
            await upload.save();
        }
    });
    form.parse(req);

});

module.exports = router;