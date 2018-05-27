// Imports
const AWS = require('aws-sdk');
const keyPairHelper = require('./helpers/keyPairHelper');

let credentials = new AWS.SharedIniFileCredentials({profile: 'personal'});
AWS.config.credentials = credentials;


AWS.config.update({region: 'us-east-1'});

const ec2 = new AWS.EC2();

//Security Group name
const sgName = 'ec2_examples_sg';
const keyName = 'ec2_example_instance';

createSecurityGroup(sgName)
    .then(() => {
        return createKeyPair(keyName);
    })
    .then(keyPairHelper.persistKeyPair)
    .then(() => {
        return createInstance(sgName, keyName)
    })
    .then((data) => {
        console.log('Created instance with:', data)
    })
    .catch((err) => {
        console.error('Failed to create instance with:', err)
    });

// Create function

function createSecurityGroup(sgName) {
    const params = {
        Description: sgName,
        GroupName: sgName,
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
}

function createKeyPair(keyName) {
    const params = {KeyName: keyName};

    return new Promise((resolve, reject) => {
        ec2.createKeyPair(params, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data)
        })
    })
}

function createInstance(sgName, keyName) {
    const params = {
        ImageId: 'ami-14c5486b', //AMI ID that will be used to create the instance
        InstanceType: 't2.micro',
        KeyName: keyName,
        Name: keyName,
        MaxCount: 1,
        MinCount: 1,
        SecurityGroups: [
            sgName
        ],
        //The UserData base64 encoded from ec2-startup.sh file.
        UserData: 'IyEvYmluL2Jhc2gNCmN1cmwgLS1zaWxlbnQgLS1sb2NhdGlvbiBodHRwczovL3JwbS5ub2Rlc291cmNlLmNvbS9zZXR1cF8xMC54IHwgc3VkbyBiYXNoIC0NCnN1ZG8geXVtIGluc3RhbGwgLXkgbm9kZWpzDQpzdWRvIHl1bSBpbnN0YWxsIC15IGdpdA0KZ2l0IGNsb25lIGh0dHBzOi8vZ2l0aHViLmNvbS9jb2RlcmFkZS9hd3MtZWMyLWV4YW1wbGVzDQpjZCBoYmZsDQpucG0gaQ0KbnBtIHJ1biBzdGFydA=='
    };

    return new Promise((resolve, reject) => {
        ec2.runInstances(params, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data)
        })
    })
}
