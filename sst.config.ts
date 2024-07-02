import { SSTConfig } from "sst";
import { myApi } from "./infra/api";
import { site } from "./infra/site";

export default {
  config(_input) {
    let stage = _input.stage;
    if (_input.stage === undefined) {
      stage = "dev";
    }

    return {
      name: "mockIot",
      region: "us-west-1",
      profile: process.env.aws_profile,
      stage: stage,
    };
  },
  stacks(app) {
    if (app.stage !== "production") {
      app.setDefaultRemovalPolicy("destroy");
    }
    app.stack(myApi).stack(site);
    app.setDefaultFunctionProps({
      timeout: 5,
      memorySize: 128,
    });
  },
} satisfies SSTConfig;
