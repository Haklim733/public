import { describe, it } from "vitest";
import { generateARVisionData, generateUniqueToken } from "./simulator";

describe("generateARVisionData", () => {
  it("should output all telemetry needed", async () => {
    let data = await generateARVisionData("testDeivceId");
    console.log(data);
  });
});

describe("generateToken", () => {
  it("test", async () => {
    const uniqueToken = generateUniqueToken();
    console.log(uniqueToken);
  });
});
