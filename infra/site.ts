import { StaticSite, StackContext, use } from "sst/constructs";
import { myApi } from "./api";
import { RemovalPolicy } from "aws-cdk-lib";

export function site({ stack }: StackContext) {
  const api = use(myApi);
  const site = new StaticSite(stack, "StaticSite", {
    path: ".",
    buildOutput: "dist",
    buildCommand: "pnpm run build",
    environment: {
      VITE_API_URL: api.api.url,
    },
    cdk: {
      bucket: {
        removalPolicy: RemovalPolicy.DESTROY,
      },
    },
    dev: {
      url: "http://localhost:5173",
      deploy: false,
    },
  });
  stack.addOutputs({
    url: api.url,
  });
  return {
    site: site,
  };
}
