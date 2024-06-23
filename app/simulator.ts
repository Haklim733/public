// SPDX-License-Identifier: MIT-0

// Script to generate simulated IoT device parameters data
import { randomInt } from "crypto";

const deviceNames: string[] = ["SBS01", "SBS02", "SBS03", "SBS04", "SBS05"];

interface DeviceData {
  positionX: number;
  positionY: number;
  positionZ: number;
  orientationPitch: number;
  orientationYaw: number;
  orientationRoll: number;
  accelerationX: number;
  accelerationY: number;
  accelerationZ: number;
  rotationRateX: number;
  rotationRateY: number;
  rotationRateZ: number;
  fieldOfView: number;
  depthData: number;
  lightIntensity: number;
  imageData: number; // Simplified representation
  surfaceDetection: boolean;
  userInteraction: boolean;
  deviceId: string;
  dateTime: string;
}

export function generateARVisionData(): DeviceData {
  const currentTime = new Date().toISOString();
  const deviceId = deviceNames[randomInt(deviceNames.length)];

  return {
    positionX: randomInt(0, 101),
    positionY: randomInt(0, 101),
    positionZ: randomInt(0, 101),
    orientationPitch: randomInt(0, 361),
    orientationYaw: randomInt(0, 361),
    orientationRoll: randomInt(0, 361),
    accelerationX: randomInt(0, 11),
    accelerationY: randomInt(0, 11),
    accelerationZ: randomInt(0, 11),
    rotationRateX: randomInt(0, 361),
    rotationRateY: randomInt(0, 361),
    rotationRateZ: randomInt(0, 361),
    fieldOfView: randomInt(70, 121),
    depthData: randomInt(1, 101),
    lightIntensity: randomInt(0, 1001),
    imageData: randomInt(0, 256), // Simplified to a grayscale value
    surfaceDetection: !!randomInt(0, 2),
    userInteraction: !!randomInt(0, 2),
    deviceId,
    dateTime: currentTime,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function timeout(startTime: number, ms: number): boolean {
  return Date.now() - startTime > ms; // 600000 milliseconds = 10 minutes
}

export async function simulateARVisionData() {
  const startTime = Date.now(); // Get the current time in milliseconds
  let condition = true;

  while (condition) {
    generateARVisionData();
    await sleep(1000); // Sleep for 1000 milliseconds (1 second) between calls
    condition = timeout(startTime, 600000); // Check if the function has been running for 10 minutes
  }
}
