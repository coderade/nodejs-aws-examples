const AWS = require('aws-sdk');

let credentials = new AWS.SharedIniFileCredentials({profile: 'personal'});
AWS.config.credentials = credentials;
AWS.config.update({region: 'us-east-1'});

const ec2 = new AWS.EC2();


const detachVolume = (volumeId) => {
    const params = {
        VolumeId: volumeId
    };

    return new Promise((resolve, reject) => {
        ec2.detachVolume(params, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data)
        })
    })
};

const attachVolume = (instanceId, volumeId) => {
    const params = {
        InstanceId: instanceId,
        VolumeId: volumeId,
        Device: '/dev/sdv'
    };

    return new Promise((resolve, reject) => {
        ec2.attachVolume(params, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data)
        })
    })
};

const volumeId = process.env.VOLUME_ID;
const instanceId = process.env.INSTANCE_ID;

detachVolume(volumeId)
    .then(() => attachVolume(instanceId, volumeId))
    .catch((err) => {
        console.error('Failed to reattach the Volumes:', err)
    });