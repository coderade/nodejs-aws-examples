const AWS = require('aws-sdk');

let credentials = new AWS.SharedIniFileCredentials({profile: 'personal'});
AWS.config.credentials = credentials;
AWS.config.update({region: 'us-east-1'});

const ec2 = new AWS.EC2();

/**
 * Create a security group for a Linux instance
 * https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-network-security.html
 * @param {String} sgName - the Name of the security group
 * @param {Number} port - the port to be open the connection over HTTP
 * @return Promise - The promise to be handled with ec2.createSecurityGroup and ec2.authorizeSecurityGroupIngress methods
 */
const createSecurityGroup = (sgName, port) => {
    return new Promise((resolve, reject) => {

        const params = {
            Description: sgName,
            GroupName: sgName
        };

        ec2.createSecurityGroup(params, (err, data) => {
            if (err) reject(err);
            else {
                const params = {
                    GroupId: data.GroupId,
                    IpPermissions: [
                        {
                            IpProtocol: 'tcp',
                            FromPort: port,
                            ToPort: port,
                            IpRanges: [
                                {
                                    CidrIp: '0.0.0.0/0'
                                }
                            ]
                        }
                    ]
                };
                ec2.authorizeSecurityGroupIngress(params, (err) => {
                    if (err) reject(err);
                    else resolve(data.GroupId)
                })
            }
        })
    })
};

exports.createSecurityGroup = createSecurityGroup;