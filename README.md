# nodejs-aws-examples

Project with some examples of how to work with the AWS using the
[AWS SDK for JavaScript in Node.js](https://aws.amazon.com/sdk-for-node-js/).

## Examples

### EC2

Examples of how to work with EC2 instances

#### Creating Instances and the needed settings

- Create a Security Group -> [`create-ec2-instance.js`](ec2/create-ec2-instance.js) file
- Create and persist the KeyPairs -> [`create-ec2-instance.js`](ec2/create-ec2-instance.js) file.
- Create an instance -> [`create-ec2-instance.js`](ec2/create-ec2-instance.js) file.
- Create the instance Tags -> [`create-ec2-instance.js`](ec2/create-ec2-instance.js) file.

#### Managing Instances
- List instances -> [`manage-ec2-instance.js`](ec2/manage-ec2-instance.js) file.
- Terminate instances -> [`manage-ec2-instance.js`](ec2/manage-ec2-instance.js) file.
- Stop instances -> [`stop-ec2-instance.js`](ec2/stop-ec2-instance.js) file.

#### Creating AMIs
- Create a AMI -> [`create-ec2-ami.js`](ec2/create-ec2-ami.js) file.

#### AutoScaling
- Create a Launch configuration -> [`create-launching-configuration.js`](ec2/create-launching-configuration.js) file.
- Create a Load Balancer -> [`create-load-balancer.js`](ec2/create-load-balancer.js) file.
- Create a Auto Scaling Group  -> [`create-auto-scaling.js`](ec2/create-auto-scaling.js) file.
- Create a Auto Scaling Group Policy -> [`create-auto-scaling.js`](ec2/create-auto-scaling.js) file.
