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
  memorySize: 128,
  reservedConcurrentExecutions: 5, // Set the concurrency limit here
});

//website bucket
const siteBucket = new aws.s3.Bucket("siteBucket", {
  website: {
    indexDocument: "index.html",
  },
});
const oai = new aws.cloudfront.OriginAccessIdentity("myOai");
const s3BucketPolicy = new aws.s3.BucketPolicy("myBucketPolicy", {
  bucket: siteBucket.bucket,
  policy: siteBucket.bucket.apply((bucket) =>
    JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Action: "s3:GetObject",
          Effect: "Allow",
          Resource: `arn:aws:s3:::${bucket}/*`,
          Principal: {
            AWS: `arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${oai.id}`,
          },
        },
      ],
    })
  ),
});

// Upload the contents of the 'www' directory
const siteDir = "app/frontend"; // Directory for website content
for (let item of fs.readdirSync(siteDir)) {
  let filePath = path.join(siteDir, item);
  let object = new aws.s3.BucketObject(item, {
    bucket: siteBucket,
    source: new pulumi.asset.FileAsset(filePath),
    contentType: mime.getType(filePath) || undefined,
  });
}

// Create a CloudFront distribution for the website
const cdn = new aws.cloudfront.Distribution("siteDistribution", {
  origins: [
    {
      originId: siteBucket.arn,
      domainName: siteBucket.websiteEndpoint,
      customOriginConfig: {
        originProtocolPolicy: "http-only",
        httpPort: 80,
        httpsPort: 443,
        originSslProtocols: ["TLSv1.2"],
      },
      s3OriginConfig: {
        originAccessIdentity: oai.cloudfrontAccessIdentityPath,
      },
    },
  ],
  enabled: true,
  isIpv6Enabled: true,
  defaultRootObject: "index.html",
  defaultCacheBehavior: {
    targetOriginId: siteBucket.arn,
    viewerProtocolPolicy: "redirect-to-https",
    allowedMethods: ["GET", "HEAD"],
    cachedMethods: ["GET", "HEAD"],
    forwardedValues: {
      queryString: false,
      cookies: { forward: "none" },
    },
    minTtl: 0,
    defaultTtl: 3600,
    maxTtl: 86400,
  },
  priceClass: "PriceClass_100",
  restrictions: {
    geoRestriction: {
      restrictionType: "whitelist",
      locations: ["US", "CA"],
    },
  },
  viewerCertificate: {
    cloudfrontDefaultCertificate: true,
  },
});

// Export the names of the resources
export const siteBucketName = siteBucket.bucket;
export const iotBucketName = iotBucket.bucket;
export const cdnDomain = cdn.domainName;
