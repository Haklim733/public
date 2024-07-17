import { CnameRecord, HostedZone } from "aws-cdk-lib/aws-route53";
import { StackContext } from "sst/constructs";

const PROD = "iamlim.com";
const STAGING = "dev.iamlim.com";
const SUBDOMAIN = "iot"; // Example subdomain prefix for www
let domainName = "";

export function DNS(ctx: StackContext) {
  let zone = undefined;
  let domain = "";
  let cloudfrontId = "";
  if (ctx.app.local) {
    return {
      zone: "",
      domainName: "http://localhost:5173",
      domain: domain,
      cloudfrontId: cloudfrontId,
    };
  } else if (ctx.app.stage === "prod") {
    zone = HostedZone.fromLookup(ctx.stack, "zone", {
      domainName: PROD,
    });
    domainName = `${SUBDOMAIN}.${PROD}`;
    domain = PROD;
    cloudfrontId = "E1UDX1V0S3EFK3";
  } else if (ctx.app.stage === "dev" && !ctx.app.local) {
    zone = HostedZone.fromLookup(ctx.stack, "zone", {
      domainName: STAGING,
    });
    domainName = `${SUBDOMAIN}.${STAGING}`;
    domain = STAGING;
  } else if (ctx.app.stage.startsWith("pr")) {
    zone = HostedZone.fromLookup(ctx.stack, "zone", {
      domainName: STAGING,
    });
    domainName = `${SUBDOMAIN}.${ctx.stack.stage}.${STAGING}`;
    domain = `${ctx.stack.stage}.${STAGING}`;
  }

  return {
    zone: zone,
    domainName: domainName,
    domain: domain,
    cloudfrontId: cloudfrontId,
  };
}
