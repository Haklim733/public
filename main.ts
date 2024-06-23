import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

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

// Next, create the Lambda function itself.
const mockIotDevice = new aws.lambda.Function("mockIotDevice", {
  runtime: "nodejs20.x",
  role: iotSimulatorRole.arn,
  handler: "index.handler",

  // Upload the code for the Lambda from the "./app" directory.
  code: new pulumi.asset.AssetArchive({
    ".": new pulumi.asset.FileArchive("./app"),
  }),
});
