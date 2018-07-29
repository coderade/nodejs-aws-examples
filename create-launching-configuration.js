const AWS = require('aws-sdk');
const IAMHelper = require('./helpers/IAMHelper');

let credentials = new AWS.SharedIniFileCredentials({profile: 'personal'});
AWS.config.credentials = credentials;
AWS.config.update({region: 'us-east-1'});

const autoScaling = new AWS.AutoScaling();

/**
 * Create a Launch Configuration
 * https://docs.aws.amazon.com/autoscaling/ec2/userguide/LaunchConfiguration.html
 * Pass the AMI_ID as environment variable. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/finding-an-ami.html
 * @param {String} lcName - the name of the Launch configuration
 * @param {String} profileArn  - the ARN ogf the IAM instance profile
 * @param {String} keyName - the name of the key pair used on the instance
 * @return Promise - The promise to be handled with the autoScaling.createLaunchConfiguration method
 */
const createLaunchConfiguration = (lcName, profileArn, keyName) => {

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
        IamInstanceProfile: profileArn,
        ImageId: process.env.AMI_ID,
        InstanceType: 't2.micro',
        LaunchConfigurationName: lcName,
        KeyName: keyName,
        SecurityGroups: [
            sgNameLC
        ],
        UserData: new Buffer(commandsString).toString('base64')
    };

    return new Promise((resolve, reject) => {
        autoScaling.createLaunchConfiguration(params, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data)
        })
    })
};


const lcName = 'ec2_examples_LC';
const roleName = 'ec2ExamplesRole';
const sgNameLC = 'ec2_examples_security_group';
const keyName = 'ec2_examples_instance_key';


IAMHelper.createIamRole(roleName)
    .then(profileArn => createLaunchConfiguration(lcName, profileArn, keyName))
    .then(data => console.log(data))
    .catch(err => console.error(`There is an error creating the Launching configuration => ${err}`));

