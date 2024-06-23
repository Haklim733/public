import { describe, it, expect } from "vitest";
import { generateARVisionData } from "./simulator";

describe("generateARVisionData", () => {
  it("should output all telemetry needed", async () => {
    let data = await generateARVisionData();
    console.log(data);
  });
});
