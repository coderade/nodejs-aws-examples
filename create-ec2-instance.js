// Imports
const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'});

const ec2 = new AWS.EC2();

//Security Group name
const sgName = 'ec2_sg';
const keyName = 'ec2_key';

createSecurityGroup(sgName).then(() => {
    return createKeyPair(keyName);
});

// Create functions

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
                    else {

                    }
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
    // TODO: create ec2 instance
}
