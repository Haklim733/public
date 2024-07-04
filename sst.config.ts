import { SSTConfig } from "sst";
import { myApi } from "./stacks/api";
import { site } from "./stacks/site";

export default {
  config(_input) {
    return {
      name: "mockIot",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(myApi).stack(site);
  },
} satisfies SSTConfig;
