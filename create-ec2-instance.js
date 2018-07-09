const AWS = require('aws-sdk');
const keyPairHelper = require('./helpers/keyPairHelper');

let credentials = new AWS.SharedIniFileCredentials({profile: 'personal'});
AWS.config.credentials = credentials;
AWS.config.update({region: 'us-east-1'});

const ec2 = new AWS.EC2();

const sgName = 'ec2_examples_security_group';
const sgDescription = 'ec2_examples Security Group description';
const keyName = 'ec2_examples_instance_key';
const instanceTagName = 'EC2 Examples';

/**
 * Create a security group for a Linux instance
 * https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-network-security.html
 * @param {String} sgName - the Name of the security group
 * @param {String} sgDescription - the description of the security group
 * @return Promise - The promise to be handled with ec2.createSecurityGroup and ec2.authorizeSecurityGroupIngress methods
 */
const createSecurityGroup = (sgName, sgDescription) => {
    const params = {
        GroupName: sgName,
        Description: sgDescription
    };

    return new Promise((resolve, reject) => {
        ec2.createSecurityGroup(params, (err, data) => {
            if (err)
                reject(err);
            else {
                let params = {
                    GroupId: data.GroupId,
                    IpPermissions: [
                        {
                            IpProtocol: 'tcp',
                            FromPort: 22,
                            ToPort: 22,
                            IpRanges: [
                                {
                                    CidrIp: '0.0.0.0/0'
                                }
                            ]
                        },
                        {
                            IpProtocol: 'tcp',
                            FromPort: 3000,
                            ToPort: 3000,
                            IpRanges: [
                                {
                                    CidrIp: '0.0.0.0/0'
                                }
                            ]
                        }
                    ]
                };
                ec2.authorizeSecurityGroupIngress(params, (err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            }
        })
    })
};


/**
 * Create the KeyPairs to be used on a Linux instance
 * https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html
 * @param {String} keyName - the Name of the Key Pair
 * @return Promise - The promise to be handled with eec2.createKeyPair method
 */
const createKeyPair = (keyName) => {
    const params = {KeyName: keyName};

    return new Promise((resolve, reject) => {
        ec2.createKeyPair(params, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data)
        })
    })
};


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

/**
 * Create the tags for a EC2 Instance
 * https://aws.amazon.com/ec2/instance-types
 * @param {String} instanceData - the data of the instance to be got the InstanceId
 * @return Promise - The promise to be handled with the ec2.createTags method
 */
const createInstanceTag = (instanceData) => {
    const params = {
        Resources: [instanceData.Instances[0].InstanceId],
        Tags: [
            {
                Key: 'Name',
                Value: instanceTagName
            }
        ]
    };

    return new Promise((resolve, reject) => {
        ec2.createTags(params, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data)
        })
    })
};

createSecurityGroup(sgName, sgDescription)
    .then(() => {
        return createKeyPair(keyName);
    })
    .then(keyPairHelper.persistKeyPair)
    .then(() => {
        return createInstance(sgName, keyName)
    })
    .then(createInstanceTag)
    .catch((err) => {
        console.error('Failed to create instance with:', err)
    });