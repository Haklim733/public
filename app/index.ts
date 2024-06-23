import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { simulateARVisionData } from "./simulator";

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<void | APIGatewayProxyStructuredResultV2> => {
  await simulateARVisionData(); // Use the imported function in your Lambda handler
};
