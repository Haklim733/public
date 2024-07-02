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
    routes: {
      "POST /iot/simulate": {
        function: {
          handler: "app/index.handler",
        },
        memorySize: 256,
        timeout: 60 * 10,
      },
    },
  });
  stack.addOutputs({
    url: api.url,
  });
  return {
    api,
  };
}
