import { StaticSite, StackContext, use } from "sst/constructs";
import { myApi } from "./api";

export function site({ stack }: StackContext) {
  const api = use(myApi);
  console.log(api.api.url);
  const site = new StaticSite(stack, "StaticSite", {
    path: "./index.html",
    // buildOutput: "dist",
    // buildCommand: "pnpm sst build",
    environment: {
      VITE_API_URL: api.api.url,
    },
  });
  return {
    site: site,
  };
}
