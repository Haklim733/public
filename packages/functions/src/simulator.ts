// SPDX-License-Identifier: MIT-0

// Script to generate simulated IoT device parameters data
import { randomInt, randomBytes } from "crypto";

export interface DeviceData {
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

export function generateARVisionData(deviceId: string): DeviceData {
  const currentTime = new Date().toISOString();

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
    deviceId: deviceId,
    dateTime: currentTime,
  };
}

export function timeout(startTime: number, ms: number): boolean {
  return Date.now() - startTime > ms; // 600000 milliseconds = 10 minutes
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomSleep(min: number, max: number): Promise<void> {
  const sleepTime = getRandomInt(min, max);
  return new Promise((resolve) => setTimeout(resolve, sleepTime));
}

export function generateUniqueToken(): string {
  const token = randomBytes(32); // Generates 32 bytes of random data
  return token.toString("hex"); // Converts the token to a hexadecimal string
}
