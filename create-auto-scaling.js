const AWS = require('aws-sdk');

let credentials = new AWS.SharedIniFileCredentials({profile: 'personal'});
AWS.config.credentials = credentials;
AWS.config.update({region: 'us-east-1'});

const autoScaling = new AWS.AutoScaling();

const asgName = 'ec2_examples_ASG'; //Auto Scaling group name
const lcName = 'ec2_examples_LC';
const policyName = 'ec2_examples_AC_policy';
const tgArn = process.env.TARGET_GROUP_ARN; //Pass the TargetGroup as ENV param.

/**
 * Create the Auto Scaling Group
 * https://docs.aws.amazon.com/autoscaling/ec2/userguide/AutoScalingGroup.html
 * @param {String} asgName - the Auto Scaling Group name
 * @param {String} lcName - the Launch configuration name
 * @return Promise - The promise to be handled
 */
const createAutoScalingGroup = (asgName, lcName) => {
    const params = {
        AutoScalingGroupName: asgName,
        AvailabilityZones: [
            'us-east-1a',//The availability zones need to match the subnets used in the load balancer so that the
            'us-east-1b' //Auto Scaling group doesn't create an instance that can't attach to the load balance
        ],
        TargetGroupARNs: [tgArn],
        LaunchConfigurationName: lcName, //This property ties the Auto Scaling group to the this launch configuration.
        MaxSize: 2, //Defines the maximum number of instances to create.
        MinSize: 1 //Defines the minimum number of instances to create.
    };

    return new Promise((resolve, reject) => {
        autoScaling.createAutoScalingGroup(params, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data)
        })
    })
};

/**
 * Create the Auto Scaling Group
 * https://docs.aws.amazon.com/autoscaling/ec2/userguide/AutoScalingGroup.html
 * @param {String} asgName - the Auto Scaling Group name
 * @param {String} policyName - the policy name
 * @return Promise - The promise to be handled
 */
const createASGPolicy = (asgName, policyName) => {
    const params = {
        AdjustmentType: 'ChangeInCapacity', //Define what the policy should do
        AutoScalingGroupName: asgName,
        PolicyName: policyName,
        PolicyType: 'TargetTrackingScaling',
        TargetTrackingConfiguration: {
            TargetValue: 5, // This example will scale up if the average CPU utilization for all the instances is above 5%
                            // or down if falls bellow
            PredefinedMetricSpecification: {
                PredefinedMetricType: 'ASGAverageCPUUtilization'
            }

        } //Details of what attribute to use to track to. This example use CPU
    };

    return new Promise((resolve, reject) => {
        autoScaling.putScalingPolicy(params, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data)
        })
    })
};

createAutoScalingGroup(asgName, lcName)
    .then(() => createASGPolicy(asgName, policyName))
    .then((data) => console.log(data))
    .catch(err => console.error(`Failed to create the AutoScaling Group ${asgName}: ${err}`));