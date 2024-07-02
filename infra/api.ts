import {
  Api,
  ApiCorsProps,
  Bucket,
  Config,
  Function,
  Stack,
  StackContext,
} from "sst/constructs";

import * as cdk from "aws-cdk-lib";

export function myApi({ stack, app }: StackContext) {
  const getCors = (stack: Stack): ApiCorsProps => {
    console.log(`api: ${stack.stage}`);
    if (app.stage === "dev") {
      return {
        allowCredentials: true,
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
          "X-Amz-Security-Token",
          "Set-Cookie",
        ],
        allowMethods: ["GET", "POST", "OPTIONS"],
        allowOrigins: ["http://localhost:5173/"],
        exposeHeaders: ["Date", "x-api-id"],
      };
    }

    return {
      allowCredentials: true,
      allowHeaders: ["Content-Type", "X-Amz-Date", "Authorization"],
      allowMethods: ["GET", "POST", "OPTIONS"],
      exposeHeaders: ["Date", "x-api-id"],
    };
  };

  const bucket = new Bucket(stack, "dataBucket", {
    blockPublicACLs: true,
    cdk: {
      bucket: {
        autoDeleteObjects: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    },
  });

  const secret = new Config.Secret(stack, "TestIoTApiToken");

  const api = new Api(stack, "Api", {
    authorizers: {
      myAuthorizer: {
        type: "lambda",
        function: new Function(stack, "Authorizer", {
          handler: "app/apiAuthorizer.handler",
          timeout: 5,
          memorySize: 128,
          bind: [secret],
        }),
        resultsCacheTtl: "30 seconds",
      },
    },
    defaults: {
      function: {
        timeout: 20,
        memorySize: 256,
        bind: [bucket],
        permissions: [bucket],
        environment: { STAGE: app.stage },
      },
      throttle: {
        rate: app.stage === "production" ? 20 : 10,
        burst: app.stage === "production" ? 40 : 20,
      },
    },
    accessLog: {
      retention: "six_months",
    },
    cors: getCors(stack),
    routes: {
      "POST /iot/simulate": {
        function: {
          handler: "app/index.handler",
        },
      },
    },
  });
  console.log(api.url);
  return {
    api,
  };
}
