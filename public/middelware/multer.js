import multer from 'multer';
import path from "path";
import s3Storage from 'multer-sharp-s3'
import AWS from 'aws-sdk'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../../travelDate/image");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const multerFilter = (req, file, cb) => {
    if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
    ) {
        cb(null, true);
    } else {
        cb("please upload right image");
    }
};

export const userImage = multer({ storage: storage, fileFilter: multerFilter });


AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_S3,
    secretAccessKey: process.env.SECRET_KEY_S3,
    region: "ap-south-1"
    // Bucket: 'bookerz',
});
const s3 = new AWS.S3();
export const uploadToS3 = function upload(destinationPath) {
    return multer({
        storage: s3Storage({
            s3: s3,
            Bucket: 'traveldateweb',
            ACL: 'public-read',
            // contentType: multerS3.AUTO_CONTENT_TYPE,
            Key: function (req, file, cb) {
                let extention = file.originalname.split('.')
                cb(
                    null,
                    destinationPath + "/" +
                    destinationPath +
                    '_' +
                    Date.now().toString() +
                    '.' +
                    extention[extention.length - 1]
                );
            },
            transform: function (req, file, cb) {
                cb(
                    null,
                    sharp().jpg({ quality: 60 })
                );
            }
        }),
        limits: { fileSize: 2 * 1024 * 1024 } // 2 mb file limit
    });
};