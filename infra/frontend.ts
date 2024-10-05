import {stream} from "./kinesis"

export const site = new sst.aws.SvelteKit("MockIotSite", {
  dev: {
    autostart: true,
  },
  buildCommand: "bun run build",
  environment: {
    VITE_STAGE: $app.stage, 
    VITE_DOMAIN: $app.stage === "prod" ? "iot.iamlim.com" : "iot.dev.iamlim.com",
  },
  link: [stream],
  path: "packages/frontend",
  permissions: [
  ],
  server: {
    memory: "512 MB",
  },
});
