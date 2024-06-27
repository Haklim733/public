import { Resource } from "sst";
import type { APIGatewayTokenAuthorizerEvent, Context } from "aws-lambda";

interface AuthPolicyDocument {
  Version: string;
  Statement: Array<{
    Action: string;
    Effect: string;
    Resource: string;
  }>;
}

interface AuthResponse {
  principalId: string;
  policyDocument: AuthPolicyDocument;
  context?: { [key: string]: string | number | boolean };
  usageIdentifierKey?: string;
}

function generatePolicy(principalId: string, effect: string, resource: string) {
  let authResponse: AuthResponse = {
    principalId: principalId,
    policyDocument: { Version: "2012-10-17", Statement: [] },
  };
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    };
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
}

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent,
  context: Context
): Promise<void | AuthResponse> => {
  let authorization = event.authorizationToken;
  let methodArn = event.methodArn;
  let apiKey = "";
  if (authorization) {
    apiKey = authorization.slice(7); // Remove "Bearer " prefix
    if (apiKey === Resource.TestIotApiToken.value) {
      return generatePolicy("user", "Allow", methodArn);
    }
  }
  return generatePolicy("user", "Deny", methodArn);
};
