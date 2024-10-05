
const exposeHeaders = ["Date", "Keep-Alive", "X-Custom-Header", "X-Amz-Request-Id", "Content-Type", "Content-Length", "Access-Control-Allow-Origin"]
const allowHeaders =  ["Content-Type", "Origin", "Expires", "Accept", "X-Requested-With", "Cache-Control", "Access-Control-Allow-Origin"]


export const appBucket = new sst.aws.Bucket("MyAppBucket", {
  public: true,
  cors: {
    allowHeaders: ["*"],
    allowMethods: ["HEAD", "GET", "POST"],
    exposeHeaders: exposeHeaders,
    maxAge: '1 hour',
  },
  transform: {
    policy(args) {
      args.policy = {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: "*",
            Action: "s3:GetObject",
            Resource: $interpolate`arn:aws:s3:::${args.bucket}/public/*`,
          },
          {
            Effect: "Allow",
            Principal: "*",
            Action: "s3:ListBucket",
            Resource: $interpolate`arn:aws:s3:::${args.bucket}`,
          },
        ],
      };
    },
  }
  }
);

export const apiFunction = new sst.aws.Function("MyApiFunction", {
  handler: "packages/functions/src/api.handler",
  url: {
    cors: {
      allowMethods: ["GET", "HEAD"],
      allowOrigins: $app.stage==="prod" ? ["iot.iamlim.com"] : ["dev.iot.iamlim.com"],
      exposeHeaders: exposeHeaders,
      allowHeaders: allowHeaders,
    },
  },
  link: [appBucket],
  permissions: [
    {
      actions: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject", "s3:ListBucket", "s3:List*"],
      resources: [appBucket.arn],
    },
  ],
  runtime: "nodejs20.x",
});


export const router = new sst.aws.Router("MyRouter", {
  domain: {
    dns: sst.aws.dns({
      zone: $app.stage === "prod" ? "Z0140882217FY9MCT4KM1" : "Z1048110TMWW9X3WITD5",
    }),
    name: $app.stage === "prod" ? "iot.iamlim.com" : "iot.dev.iamlim.com",
  },
  routes: {
    "/iot/mock": apiFunction.url,
  },
});