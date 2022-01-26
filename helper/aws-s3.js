import S3 from "aws-sdk/clients/s3";
import fs from 'fs';

const { BUCKET_NAME,
    ACCESS_ID,
    ACCESS_SECRET
} = process.env;


const s3 = new S3({
    accessKeyId: ACCESS_ID,
    secretAccessKey: ACCESS_SECRET
})

export const uploadFile = (file) => {

    console.log('bucket',BUCKET_NAME,
    ACCESS_ID,
    ACCESS_SECRET)
    try {
        const fileStream = fs.createReadStream(file.path);
        console.log("file", file)
        const uploadParams = {
            Bucket: BUCKET_NAME,
            Body: fileStream,
            Key: file.filename,
        };
        return s3.upload(uploadParams).promise();
    } catch (err) {
        console.log("uploadFile::catch", err);
    }
};
