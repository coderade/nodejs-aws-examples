# nodejs-aws-ec2-examples

Project with some examples of how to work with EC2 instances using the
[AWS SDK for JavaScript in Node.js](https://aws.amazon.com/sdk-for-node-js/).

## Examples

### Creating Instances and the needed settings

- Create a Security Group -> [`create-ec2-instance.js`](create-ec2-instance.js) file
- Create and persist the KeyPairs -> [`create-ec2-instance.js`](create-ec2-instance.js) file.
- Create an instance -> [`create-ec2-instance.js`](create-ec2-instance.js) file.
- Create the instance Tags -> [`create-ec2-instance.js`](create-ec2-instance.js) file.

### Managing Instances
- List instances -> [`manage-ec2-instance.js`](manage-ec2-instance.js) file.
- Terminate instances -> [`manage-ec2-instance.js`](manage-ec2-instance.js) file.

### Creating AMIs
- Create a AMI -> [`create-ec2-ami.js`](create-ec2-ami.js) file.

## AutoScaling
- Create a Launch configuration -> [`create-launching-configuration.js`](create-launching-configuration.js) file.
- Create a Load Balancer -> [`create-load-balancer.js`](create-load-balancer.js) file.
- Create a Auto Scaling Group  -> [`create-auto-scaling.js`](create-auto-scaling.js) file.
- Create a Auto Scaling Group Policy -> [`create-auto-scaling.js`](create-auto-scaling.js) file.
