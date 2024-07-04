import { StaticSite, StackContext, use } from "sst/constructs";
import { myApi } from "./api";
import { RemovalPolicy } from "aws-cdk-lib";

export function site({ stack }: StackContext) {
  const api = use(myApi);
  const site = new StaticSite(stack, "StaticSite", {
    path: "packages/frontend",
    buildCommand: "pnpm run build",
    buildOutput: "dist",
    bind: [api],
    environment: {
      VITE_APP_API_URL: api.url,
    },
    cdk: {
      bucket: {
        autoDeleteObjects: true,
        removalPolicy: RemovalPolicy.DESTROY,
      },
    },
    dev: {
      url: "http://localhost:5173",
      deploy: false,
    },
  });
  stack.addOutputs({
    SiteUrl: site.url,
    ApiEndpoint: api.url,
  });
  return {
    site: site,
  };
}