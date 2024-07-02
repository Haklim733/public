/* tslint:disable */
/* eslint-disable */
import "sst";
declare module "sst" {
  export interface Resource {
    Authorizer: {
      name: string;
      type: "sst.aws.Function";
    };
    MyApi: {
      type: "sst.aws.ApiGatewayV2";
      url: string;
    };
    StaticSite: {
      type: "sst.aws.StaticSite";
      url: string;
    };
    TestIotApiToken: {
      type: "sst.sst.Secret";
      value: string;
    };
  }
}
export {};
