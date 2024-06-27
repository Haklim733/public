/// <reference path="./.sst/platform/config.d.ts" />
import * as pulumi from "@pulumi/pulumi";

let stage = "";

export default $config({
  app(input) {
    if (input.stage === undefined) {
      stage = "dev";
    }

    return {
      name: "mock-iot",
      removal: input?.stage === "production" ? "retain" : "remove",
      region: "us-west-1",
      home: "aws",
      stage: stage,
      providers: {
        aws: {
          region: "us-west-1",
        },
      },
    };
  },
  async run() {
    const getCors = (stage: string) => {
      if (stage === "dev") {
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
        allowOrigins: [`https://${dns!.domain}`],
        exposeHeaders: ["Date", "x-api-id"],
      };
    };

    const bucket = new sst.aws.Bucket("DataBucket", {
      public: true,
    });
    const api = new sst.aws.ApiGatewayV2("MyApi", {
      accessLog: {
        retention: "1 week",
      },
    });
    api.route(
      "GET /simulate",
      {
        handler: "app/simulator.handler",
        link: [bucket],
      },
      {
        auth: {
          iam: true,
        },
      }
    );
    // api.getProvider.arguments.corsConfiguration = getCors("dev");
    const secret = new sst.Secret("TestIotApiToken", "TestIotApiToken");
    const authorizer = new sst.aws.Function("Authorizer", {
      handler: "app/apiAuthorizer.handler",
      memory: "256 MB",
      link: [secret],
    });
    const authorizerUri = pulumi.interpolate`arn:aws:apigateway:${aws.config.region}:lambda:path/2015-03-31/functions/${authorizer.nodes.function.arn}/invocations`;

    new aws.apigatewayv2.Authorizer("ApiAuthorizer", {
      apiId: api.nodes.api.id,
      authorizerType: "REQUEST",
      authorizerUri: authorizerUri,
      identitySources: ["$request.header.Authorization"],
      name: "basicAuth",
      authorizerPayloadFormatVersion: "2.0",
    });

    const site = new sst.aws.StaticSite("StaticSite", {
      path: "lib",
    });

    return {
      bucketName: bucket.name,
      siteUrl: site.url,
    };
  },
});
