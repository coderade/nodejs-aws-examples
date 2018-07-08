const AWS = require('aws-sdk');

/**
 * Create a IAM role
 * https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html
 * @param {String} roleName - the role name
 * @return Promise - The promise to be handled with the iam.createRole method
 */
let createIamRole = (roleName) => {
    const profileName = `${roleName}_profile`;
    const iam = new AWS.IAM();
    const params = {
        RoleName: roleName,
        AssumeRolePolicyDocument: '{ "Version": "2012-10-17", "Statement": [ { "Effect": "Allow", "Principal": { "Service": "ec2.amazonaws.com" }, "Action": "sts:AssumeRole" } ] }'
    };

    return new Promise((resolve, reject) => {
        iam.createRole(params, (err) => {
            if (err) reject(err);
            else {
                const params = {
                    PolicyArn: 'arn:aws:iam::aws:policy/AdministratorAccess',
                    RoleName: roleName
                };

                iam.attachRolePolicy(params, (err) => {
                    if (err) reject(err);
                    else {
                        iam.createInstanceProfile({InstanceProfileName: profileName}, (err, iData) => {
                            if (err) reject(err);
                            else {
                                const params = {
                                    InstanceProfileName: profileName,
                                    RoleName: roleName
                                };
                                iam.addRoleToInstanceProfile(params, (err) => {
                                    if (err) reject(err);
                                    else {
                                        // Profile creation is slow, need to wait
                                        setTimeout(() => resolve(iData.InstanceProfile.Arn), 10000)
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    })
};

module.exports = {
    createIamRole: createIamRole
};


