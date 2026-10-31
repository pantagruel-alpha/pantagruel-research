import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
test("PR gates validate publication and deployment remains on main push", () => {
  const workflow = JSON.parse(readFileSync(".github/workflows/ci.yml", "utf8"));
  assert.deepEqual(workflow.on.pull_request.branches, ["develop", "main"]);
  assert.deepEqual(workflow.on.push.branches, ["develop", "main"]);
  assert.equal(workflow.jobs.policy.name, "Personal policy");
  assert.equal(workflow.jobs.quality.name, "Integration");
  for (const name of ["deploy", "release"]) {
    assert.ok(workflow.jobs[name].if.includes("github.event_name == 'push'"));
    assert.ok(workflow.jobs[name].if.includes("github.ref == 'refs/heads/main'"));
  }
  assert.ok(workflow.jobs.quality.steps.some(step => step.run === "npm test"));
});
