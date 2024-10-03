let redirects: string[] = [];

export const site = new sst.aws.SvelteKit("MockIotSite", {
  dev: {
    autostart: true,
  },
  buildCommand: "bun run build",
  environment: {
    VITE_STAGE: $app.stage,
  },
  link: [],
  path: "packages/frontend",
  permissions: [
    // {
    // actions: ["lambda:InvokeFunction"],
    // resources: [apiFunction.arn],
    // },
  ],
  server: {
    memory: "512 MB",
  },
});
