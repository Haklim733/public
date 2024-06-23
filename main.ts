import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

const iotBucket = new aws.s3.Bucket("mockIoTBucket");
// Step 1: Define the policy document
const bucketPolicyDocument = pulumi.interpolate`{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "s3:PutObject",
    "Resource": "${iotBucket.arn}/*"
  }]
}`;

const iotBucketPolicy = new aws.iam.Policy("iotBucketPolicy", {
  policy: bucketPolicyDocument,
});

// Configure IAM so that the AWS Lambda can be run.
const iotSimulatorRole = new aws.iam.Role("iotSimulatorRole", {
  assumeRolePolicy: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Principal: {
          Service: "lambda.amazonaws.com",
        },
        Effect: "Allow",
      },
    ],
  },
});

new aws.iam.RolePolicyAttachment("iotRole", {
  role: iotSimulatorRole,
  policyArn: aws.iam.ManagedPolicies.AWSLambdaExecute,
});
new aws.iam.RolePolicyAttachment("iotBucketPolicyAttachment", {
  role: iotSimulatorRole.name,
  policyArn: iotBucketPolicy.arn,
});

// Next, create the Lambda function itself.
const mockIotDevice = new aws.lambda.Function("mockIotDevice", {
  runtime: "nodejs20.x",
  role: iotSimulatorRole.arn,
  handler: "index.handler",
  code: new pulumi.asset.AssetArchive({
    ".": new pulumi.asset.FileArchive("./app"),
  }),
  environment: { variables: { BUCKET: iotBucket.bucket, KEY: "mock/lambda" } },
});
