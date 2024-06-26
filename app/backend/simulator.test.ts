import { describe, it } from "vitest";
import { generateARVisionData } from "./simulator";

describe("generateARVisionData", () => {
  it("should output all telemetry needed", async () => {
    let data = await generateARVisionData("testDeivceId");
    console.log(data);
  });
});
