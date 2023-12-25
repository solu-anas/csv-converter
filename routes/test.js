const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send(`<form action= "/api/uploads" method="post" enctype="multipart/form-data">
        <p>CSV File: <input type="file" name="file" /></p>
        <p><input type="submit" value="Upload" /></p>
        </form>`);
});

module.exports = router;