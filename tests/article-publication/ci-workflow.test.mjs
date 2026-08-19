import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";


test("CI runs only on main and creates a SHA release", () => {
  const workflow = readFileSync(".github/workflows/ci.yml", "utf8");
  const workflows = readdirSync(".github/workflows").filter((name) => name.endsWith(".yml"));

  assert.match(workflow, /name: Continuous Integration/);
  assert.equal((workflow.match(/branches: \[main\]/g) ?? []).length, 1);
  assert.doesNotMatch(workflow, /pull_request:/);
  assert.match(workflow, /gh release create "release-\$GITHUB_SHA"/);
  assert.match(workflow, /needs: \[quality, deploy\]/);
  assert.deepEqual(workflows, ["ci.yml"]);
});
