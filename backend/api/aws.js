const AWS = require('aws-sdk');

AWS.config.update({region: 'ap-northeast-1'})
AWS.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID
AWS.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const ec2 = new AWS.EC2({apiVersion: '2016-11-15'})
const ssm = new AWS.SSM()

module.exports = { ec2, ssm }