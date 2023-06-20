
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('itemImg');

const multerUploads = (req, res, next) => {
    // console.log(req);
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