const AWS = require('aws-sdk');

let credentials = new AWS.SharedIniFileCredentials({profile: 'personal'});
AWS.config.credentials = credentials;
AWS.config.update({region: 'us-east-1'});

const ec2 = new AWS.EC2();

let listInstances = () => {
    return new Promise((resolve, reject) => {
        ec2.describeInstances({}, (err, data) => {
            if (err)
                reject(err);
            else {
                resolve(data.Reservations.reduce((i, r) => {
                    return i.concat(r.Instances)
                }, []));
            }
        })
    })
};

let terminateInstance = (instanceId) => {
    let params = {
        InstanceIds: [
            instanceId
        ]
    };

    return new Promise((resolve, reject) => {
        ec2.terminateInstances(params, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        })
    })
};

listInstances()
    .then(data => console.log(data))
    .catch((err) => {
        console.error(`Failed to list the instances ERROR: ${err}`);
    });

// let instanceID = 'i-0dadfee31ab5ec0c9';
// terminateInstance(instanceID)
//     .then(data => console.log(data))
//     .catch((err) => {
//         console.error(`Failed to terminate the instance ${instanceID}: ${err}`);
//     });
