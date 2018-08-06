const AWS = require('aws-sdk');

let credentials = new AWS.SharedIniFileCredentials({profile: 'personal'});
AWS.config.credentials = credentials;
AWS.config.update({region: 'us-east-1'});

const ec2 = new AWS.EC2();


/**
 * Create a EC2 Instance
 * https://aws.amazon.com/ec2/instance-types
 * @param {String} sgName - the Name of the security group to be used on the instance
 * @param {String} keyName - the name of the Instance
 * @return Promise - The promise to be handled with the ec2.runInstances method
 */
const createInstance = (sgName, keyName) => {

    //commands to run once the instance starts and to be use on the instance UserData
    let commandsString = `#!/bin/bash
    curl --silent --location https://rpm.nodesource.com/setup_10.x | sudo bash -
    sudo yum install -y nodejs
    sudo yum install -y git
    git clone https://github.com/coderade/aws-ec2-examples
    cd repo
    npm i
    npm run start`;

    const params = {
        ImageId: 'ami-14c5486b', //AMI ID that will be used to create the instance
        InstanceType: 't2.micro',
        KeyName: keyName,
        MaxCount: 1,
        MinCount: 1,
        SecurityGroups: [
            sgName
        ],
        UserData: new Buffer(commandsString).toString('base64')
    };

    return new Promise((resolve, reject) => {
        ec2.runInstances(params, (err, data) => {
            if (err)
                reject(err);
            else
                console.log('Created instance with:', data);
            resolve(data)
        })
    })
};

const sgName = 'ec2_examples_security_group';
const keyName = 'ec2_examples_instance_key';

createInstance(sgName, keyName)
    .catch((err) => {
        console.error('Failed to create instance with:', err)
    });