import { StaticSite, StackContext } from "sst/constructs";

export function site({ stack, app }: StackContext) {
  const site = new StaticSite(stack, "StaticSite", {
    path: "lib",
  });
  return {
    site: site,
  };
}
