const AWS = require('aws-sdk');

let credentials = new AWS.SharedIniFileCredentials({profile: 'personal'});
AWS.config.credentials = credentials;
AWS.config.update({region: 'us-east-1'});

const s3 = new AWS.S3;

const createBucket = (bucketName) => {
    const params = {
        Bucket: bucketName,
        ACL: 'public-read'
    };

    return new Promise((resolve, reject) => {
        s3.createBucket(params, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data)
        })
    })
};

const S3_BUCKET_NAME = process.env.BUCKET_NAME;

createBucket(S3_BUCKET_NAME)
    .then((data) => console.log(data))
    .catch((err) => {
        console.error(`Failed to create the bucket ${S3_BUCKET_NAME}. ERROR: ${err}`);
    });