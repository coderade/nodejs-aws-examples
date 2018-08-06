const AWS = require('aws-sdk');

let credentials = new AWS.SharedIniFileCredentials({profile: 'personal'});
AWS.config.credentials = credentials;
AWS.config.update({region: 'us-east-1'});

const ec2 = new AWS.EC2();

/**
 * Stop a EC2 Instance
 * https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_StopInstances.html
 * @param {String} instanceID - the ID of the instance to be stopped.
 * @return Promise - The promise to be handled with the ec2.stopInstances method
 */
const stopInstance = (instanceID) => {

    const params = {
        InstanceIds: [
            instanceID
        ]
    };
    return new Promise((resolve, reject) => {
        ec2.stopInstances(params, err => {
            if (err)
                reject(err);
            else
                resolve();
        });
    })
};


const instanceID = process.env.INSTANCE_ID;

stopInstance(instanceID)
    .then(() => console.log(`Stopped the instance => ${instanceID}`))
    .catch((err) => {
        console.error(`Failed to stop the instance ${instanceID} ERROR: ${err}`);
    });