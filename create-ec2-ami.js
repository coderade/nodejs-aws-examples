const AWS = require('aws-sdk');

let credentials = new AWS.SharedIniFileCredentials({profile: 'personal'});
AWS.config.credentials = credentials;
AWS.config.update({region: 'us-east-1'});

const ec2 = new AWS.EC2();

//Pass the INSTANCE_ID as environment variable
const INSTANCE_ID = process.env.INSTANCE_ID;
const INSTANCE_NAME = 'AMI example';

/**
 * Create the Amazon Machine Image
 * https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html
 * @param {String} seedInstanceId - Id of the instance to be used as seed
 * @param {String} imageName - A name identifier for the AMI
 * @return Promise - The promise to be handled
 */
const createImage = (seedInstanceId, imageName) => {
    const params = {
        InstanceId: seedInstanceId,
        Name: imageName
    };

    return new Promise((resolve, reject) => {
        ec2.createImage(params, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data)
        })
    })
};

createImage(INSTANCE_ID, INSTANCE_NAME)
    .then(() => console.log(`AMI ${INSTANCE_NAME} created`))
    .catch((err) => {
        console.error(`Failed to create the AMI ${INSTANCE_NAME}. ERROR: ${err}`);
    });