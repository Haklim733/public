import { describe, it } from "vitest";
import fetch from "node-fetch";
import { LocalWorkspace } from "@pulumi/pulumi/automation";

let apiUrl = "";

describe("invokeApi", async () => {
  const workspace = await LocalWorkspace.createOrSelectStack({
    stackName: "dev",
    projectName: "mock-iot",
  });
  await workspace.refresh();

  // Retrieve the outputs
  const outputs = await workspace.outputs();

  // Access a specific output by key
  const apiUrl: string = outputs.apiUrl.value;
  console.log(apiUrl);

  it("success", async () => {
    const res = fetch(`${apiUrl}/simulate`);
    console.log(res);
  });
});
