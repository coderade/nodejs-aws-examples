const AWS = require('aws-sdk');
const SecurityGroupHelper = require('./helpers/SecurityGroupHelper');

let credentials = new AWS.SharedIniFileCredentials({profile: 'personal'});
AWS.config.credentials = credentials;
AWS.config.update({region: 'us-east-1'});

const elbV2 = new AWS.ELBv2();

const sgName = 'ec2-examples-security-group2'; //Security Group name
const tgName = 'ec2-examples-target-group2'; //TargetGroup name - can only contain characters that are alphanumeric characters or hyphens(-)
const elbName = 'ec2-examples-ELB2'; //Elastic Load Balance Name

const subNets = [
    'subnet-fe61ed9a',
    'subnet-02a54d2d'
]; //SubNets to be used on the Load Balancer creation, to get your subnets look on the  following link:
// https://console.aws.amazon.com/vpc/home?region=us-east-1#subnets:sort=AvailabilityZone

const port = 80; //the port to be open the connection over HTTP and be used in the Load Balance listener

/**
 * Create a Load Balancer
 * https://aws.amazon.com/elasticloadbalancing
 * @param {String} lbName - the Name of Load Balancer
 * @param {String} sgId - the ID of the security group
 * @return Promise - The promise to be handled with elbV2.createLoadBalancer method
 */
const createLoadBalancer = (lbName, sgId) => {
    const params = {
        Name: lbName,
        Subnets: subNets,
        SecurityGroups: [
            sgId
        ]
    };

    return new Promise((resolve, reject) => {
        elbV2.createLoadBalancer(params, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        })
    })
};


const vpcId = process.env.VPC_ID; //To be passed as ENV variable
/**
 * Create a target Group for the listener
 * https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.htmll
 * @param {String} tgName - the TargetGroup name
 * @return Promise - The promise to be handled with elbv2.createTargetGroup method
 */
const createTargetGroup = (tgName) => {
    const params = {
        Name: tgName,
        Port: 3000,
        Protocol: 'HTTP',
        VpcId: vpcId
    };

    return new Promise((resolve, reject) => {
        elbV2.createTargetGroup(params, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data)
        })
    })
};


/**
 * Create a listener for the specified Application Load Balancer or Network Load Balancer.
 * The listener defines the relationship between the Load Balancer and the Target/Auto Scaling Group
 * @param {String} tgArn - the TargetGroup ARN
 * @param {String} lbArn - the Load Balancer ARN
 * @return Promise - The promise to be handled with elbv2.createListener method
 */
const createListener = (tgArn, lbArn) => {
    const params = {
        DefaultActions: [
            {
                TargetGroupArn: tgArn,
                Type: 'forward'
            }
        ],
        LoadBalancerArn: lbArn,
        Port: 80,
        Protocol: 'HTTP'
    };

    return new Promise((resolve, reject) => {
        elbV2.createListener(params, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data)
        })
    })
};


SecurityGroupHelper.createSecurityGroup(sgName, port)
    .then(sgId =>
        Promise.all([
            createTargetGroup(tgName),
            createLoadBalancer(elbName, sgId)
        ])
    )
    .then(results => {
        const tgArn = results[0].TargetGroups[0].TargetGroupArn;
        const lbArn = results[1].LoadBalancers[0].LoadBalancerArn;
        console.log(`Target Group Name ARN: ${tgArn}`);
        console.log(`Load Balancer ARN: ${lbArn}`);

        return createListener(tgArn, lbArn)
    })
    .then(data => console.log(data));