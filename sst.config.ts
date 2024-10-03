/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "mockIot",
      removal: input?.stage === "prod" ? "retain" : "remove",
      home: "aws",
      region: "us-west-1",
    };
  },
  async run() {
    const frontend = await import("./infra/frontend");
    return {};
  },
});
