import { v4 as uuidv4 } from "uuid";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  DeviceData,
  generateARVisionData,
  randomSleep,
  timeout,
} from "./simulator";

const s3Client = new S3Client({ region: "us-west-1" });

async function writeToS3(
  data: any,
  bucketName: string,
  key: string
): Promise<void> {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: JSON.stringify(data),
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    console.log(`Successfully wrote to ${bucketName}/${key}`);
  } catch (error) {
    console.error("Error writing to S3:", error);
  }
}

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<void | APIGatewayProxyStructuredResultV2> => {
  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const startTime = Date.now(); // Get the current time in milliseconds
  let condition = true;
  let bucket = process.env.BUCKET!;
  let batchData: DeviceData[] = [];
  let lastBatchTime = Date.now();
  let deviceId = uuidv4();

  while (condition) {
    let data = generateARVisionData(deviceId);
    batchData.push(data);
    const now = new Date();
    if (now.getTime() - lastBatchTime >= 2000) {
      const year = now.getUTCFullYear();
      const month = String(now.getUTCMonth() + 1).padStart(2, "0"); // JS months are 0-indexed
      const day = String(now.getUTCDate()).padStart(2, "0");
      const hour = String(now.getUTCHours()).padStart(2, "0");
      const minute = String(now.getUTCMinutes()).padStart(2, "0");
      const filename = `${deviceId}-${new Date()}.json`;
      const key = `${year}/${month}/${day}/${hour}/${minute}/${filename}`;
      await writeToS3(data, bucket, key);
      console.log(Date.now() - now.getTime());
      batchData = [];
      lastBatchTime = Date.now();
    }
    await randomSleep(250, 750); // 1000 milliseconds (1 second)
    condition = timeout(startTime, 30000); // Check if the function has been running for 10 minutes
  }
};
