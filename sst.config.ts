/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "public",
      removal: "remove",
      home: "aws",
      providers: {
        aws: {
          profile: input.stage === "production" ? "myprod" : "default",
          region: "us-west-1",
        },
      },
    };
  },
  async run() {
    const rtServer = await import("./infra/realtime");
    const frontend = await import("./infra/frontend");
    return {
      app: frontend.site.url,
      rtEndPoint: rtServer.rtServer.endpoint,
      rtAuthorizer: rtServer.rtServer.authorizer,
    };
  },
});
