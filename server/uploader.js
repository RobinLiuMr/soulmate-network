const multer = require("multer");
const path = require("path");
const uidSafe = require("uid-safe");

const diskStorage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename: function (request, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

module.exports = {
    uploader,
};
