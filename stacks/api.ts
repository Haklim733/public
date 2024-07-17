import {
  Api,
  Bucket,
  Config,
  Function,
  StackContext,
  use,
} from "sst/constructs";
import * as cdk from "aws-cdk-lib";
import { DNS } from "./dns";

export function TestApi({ stack }: StackContext) {
  const dns = use(DNS);
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
          handler: "packages/functions/src/apiAuthorizer.handler",
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
        environment: { STAGE: stack.stage },
      },
      throttle: {
        rate: stack.stage === "prod" ? 20 : 10,
        burst: stack.stage === "prod" ? 40 : 20,
      },
    },
    accessLog: {
      retention: "one_month",
    },
    cors: {
      allowCredentials: true,
      allowHeaders: ["Content-Type", "X-Amz-Date", "Authorization"],
      allowMethods: ["GET", "POST", "OPTIONS"],
      allowOrigins: [`https://${dns!.domainName}`],
      exposeHeaders: ["Date", "x-api-id"],
    },
    routes: {
      "POST /iot/simulate": {
        function: {
          handler: "packages/functions/src/index.handler",
          memorySize: 256,
          timeout: 60 * 10,
        },
      },
    },
    customDomain: "api." + dns.domain,
  });

  return { api };
}
