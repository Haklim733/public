import { SvelteKitSite, StackContext, use } from "sst/constructs";
import { myApi } from "./api";
import { RemovalPolicy } from "aws-cdk-lib";

export function site({ stack }: StackContext) {
  const myapi = use(myApi);
  const site = new SvelteKitSite(stack, "StaticSite", {
    path: "packages/frontend",
    buildCommand: "pnpm run build",
    environment: {
      VITE_APP_API_URL: myapi.api.url,
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
  });
  return {
    site: site,
  };
}
