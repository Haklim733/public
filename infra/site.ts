import { StaticSite, StackContext, use } from "sst/constructs";
import { myApi } from "./api";

export function site({ stack }: StackContext) {
  const api = use(myApi);
  const site = new StaticSite(stack, "StaticSite", {
    path: ".",
    buildOutput: "dist",
    buildCommand: "pnpm run build",
    environment: {
      VITE_API_URL: api.api.url,
    },
  });
  return {
    site: site,
  };
}
