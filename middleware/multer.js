
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('profileImg');

const multerUploads = (req, res, next) => {
    upload(req, res, err => {
    if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    console.log(err);
    } else if (err) {
    // An unknown error occurred when uploading.
    console.log(err);
    }
    next();
    });
    };

module.exports =  {multerUploads};