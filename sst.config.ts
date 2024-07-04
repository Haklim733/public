import { SSTConfig } from "sst";
import { myApi } from "./stacks/api";
import { site } from "./stacks/site";

export default {
  config(_input) {
    if (_input.stage === undefined) {
      _input.stage = "dev";
    }
    return {
      name: "mockIot",
      region: "us-west-1",
      stage: _input.stage, // Corrected line
    };
  },
  stacks(app) {
    app.stack(myApi).stack(site);
  },
} satisfies SSTConfig;
