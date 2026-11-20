import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  EngineSpec,
} from "@enginespec/typescript-sdk";
import * as universal from "@enginespec/typescript-sdk";
import {
  AISpecEngine,
  Repository,
} from "@enginespec/typescript-sdk/aispec-v0";

test("the TypeScript SDK exposes the Engine repository API", async () => {
  const root = await mkdtemp(join(tmpdir(), "aispec-typescript-sdk-"));
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
    await rm(root, { recursive: true, force: true });
  }
});

test("the TypeScript SDK exposes EngineSpec v2", async () => {
  assert.equal("AISpecEngine" in universal, false);
  assert.equal("Repository" in universal, false);
  const root = await mkdtemp(join(tmpdir(), "enginespec-typescript-sdk-"));
  try {
    const workspace = join(root, "workspace");
    const traceStore = join(root, "trace");
    const engine = await EngineSpec.initialize({
      name: "SDK v2",
      workspace,
      traceStore: { scheme: "file", value: traceStore },
    });
    await writeFile(join(workspace, "state.json"), '{"ok":true}\n', "utf8");
    const snapshot = await engine.capture({
      selectors: [{ type: "filesystem.file", locator: { path: "state.json" } }],
    });
    const commit = await engine.commit({
      snapshotId: snapshot.id,
      ref: "heads/main",
      expectedHead: null,
      expectedGeneration: 0,
      author: { id: "local:sdk" },
      message: "Initial state",
    });
    assert.equal((await engine.getRef("heads/main"))?.target, commit.commit.id);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
