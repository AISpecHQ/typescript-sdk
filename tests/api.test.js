import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  AISpecEngine,
  Repository,
} from "@iaspec/typescript-sdk";

test("the TypeScript SDK exposes the Engine repository API", () => {
  const root = mkdtempSync(join(tmpdir(), "aispec-typescript-sdk-"));
  try {
    const repository = Repository.create(root, {
      name: "TypeScript SDK",
      author: "test",
    });
    assert.ok(repository instanceof AISpecEngine);

    const node = { id: "assistant", edges: [] };
    repository.addNode(node);
    const snapshot = repository.createSnapshot({
      nodeId: node.id,
      configuration: { model: "example" },
    });
    const input = {
      message: "Add assistant state",
      author: "test",
      snapshotIds: [snapshot.id],
    };
    const commit = repository.createCommit(input);

    assert.equal(repository.getBranch("main")?.head, commit.id);
    assert.deepEqual(repository.validate(), { valid: true, issues: [] });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
