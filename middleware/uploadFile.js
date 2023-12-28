const { join } = require('path');
const { randomUUID } = require('crypto');
const multer = require('multer');

module.exports = function(f) {
    const storage = multer.diskStorage({
        destination: join(__dirname, '../tables/'),
        filename: (req, file, cb) => {
            const uuid = randomUUID();
            cb(null, uuid + '.csv')
        }
    });
    const upload = multer({ storage: storage });
    return upload.single(f);

}