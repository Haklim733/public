import { SSTConfig } from "sst";
import { DNS } from "./stacks/dns";
import { TestApi } from "./stacks/api";
import { TestSite } from "./stacks/site";

export default {
  config(_input) {
    return {
      name: "mock-iot",
      region: "us-west-1",
    };
  },
  stacks(app) {
    app.stack(DNS).stack(TestApi).stack(TestSite);
  },
} satisfies SSTConfig;
