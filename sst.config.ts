import { SSTConfig } from "sst";
import { api } from "./infra/api";
import { site } from "./infra/site";

export default {
  config(input) {
    let stage = input.stage;
    if (input.stage === undefined) {
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
    app.stack(api).stack(site);
    app.setDefaultFunctionProps({
      timeout: 5,
      memorySize: 128,
    });
  },
} satisfies SSTConfig;
