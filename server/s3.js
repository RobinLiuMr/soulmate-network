const { S3 } = require("aws-sdk");
const fs = require("fs");

const { AWS_KEY, AWS_SECRET } = require("../secrets.json");

const Bucket = "spicedling";

const s3 = new S3({
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
});

function s3Upload(request, response, next) {
    // console.log("request.file", request.file);
    if (!request.file) {
        console.log("[socialnetwork:s3] file not there");
        response.sendStatus(500);
        return;
    }

    const {
        filename: Key,
        mimetype: ContentType,
        size: ContentLength,
        path,
    } = request.file;

    console.log("request.file: ", request.file);

    console.log("[socialnetwork:s3] uploading to s3...", {
        Bucket,
        Key,
        ContentType,
        ContentLength,
    });

    s3.putObject({
        Bucket,
        ACL: "public-read",
        Key: request.file.filename,
        Body: fs.createReadStream(path),
        ContentType: request.file.mimetype,
        ContentLength: request.file.size,
    })
        .promise()
        .then(() => {
            console.log("[socialnetwork:s3] uploading to s3");
            next();
            // delete images in folder upload
            // fs.unlink(path, () => {});
        })
        .catch((error) => {
            console.log("[socialnetwork:s3] error uploading to s3", error);
            response.sendStatus(500);
        });
}

module.exports = { Bucket, s3Upload };
