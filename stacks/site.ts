import { StackContext, StaticSite, use } from "sst/constructs";
import { TestApi } from "./api";
import { DNS } from "./dns";
import { aws_cloudfront as cf } from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";

export function TestSite({ stack }: StackContext) {
  const api = use(TestApi);
  const dns = use(DNS);

  const existDist = cf.Distribution.fromDistributionAttributes(
    stack,
    "mainCfDistribution",
    {
      distributionId: dns.cloudfrontId,
      domainName: dns.domain,
    }
  );

  const site = new StaticSite(stack, "SvelteJSSite", {
    path: "packages/frontend",
    buildCommand: "pnpm run build",
    buildOutput: "dist",
    environment: {
      // Pass in the API endpoint to our app
      VITE_APP_API_URL: api.api.url,
    },
    customDomain: `iot.${dns.domainName}`,
    cdk: {
      bucket: {
        autoDeleteObjects: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
      distribution: existDist,
    },
    dev: {
      deploy: false,
    },
  });

  // Show the URLs in the output
  stack.addOutputs({
    SiteUrl: site.customDomainUrl || site.url,
    ApiEndpoint: api.api.customDomainUrl || api.api.url,
  });
}
