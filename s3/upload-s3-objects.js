const AWS = require('aws-sdk');
const FileHelper = require('./../helpers/FileHelper');

let credentials = new AWS.SharedIniFileCredentials({profile: 'personal'});
AWS.config.credentials = credentials;
AWS.config.update({region: 'us-east-1'});

const s3 = new AWS.S3();


const uploadS3Objects = (bucketName, files) => {
    const params = {
        Bucket: bucketName,
        ACL: 'public-read'
    };

    const filePromises = files.map((file) => {
        const objectParams = Object.assign({}, params, {
            Body: file.contents,
            Key: file.name,
            ContentType: FileHelper.getContentType(file.name)
        });

        return new Promise((resolve, reject) => {
            s3.putObject(objectParams, (err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(data)
            })
        })
    });

    return Promise.all(filePromises)
};

const bucketName = process.env.BUCKET_NAME;

FileHelper.getPublicFiles()
    .then(files => uploadS3Objects(bucketName, files))
    .then(data => console.log(data))
    .catch((err) => {
        console.error(`Failed to upload the files to S3. ERROR: ${err}`);
    });