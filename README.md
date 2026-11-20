# AISpec TypeScript SDK

Status: under development.

The TypeScript SDK is a thin, typed entry point to `@enginespec/engine`. It
re-exports the Engine API instead of maintaining a second implementation of
repository and history rules. The AISpec compatibility API is separate. `Repository` remains an alias for
`AISpecEngine`, but is imported from
`@enginespec/typescript-sdk/aispec-v0`.

The Engine package must be published before this SDK can be published because
it is a runtime dependency.

## EngineSpec v2

The same package exposes the domain-neutral API as `EngineSpec`. It does not
duplicate repository logic:

```ts
import { EngineSpec } from "@enginespec/typescript-sdk";

const engine = await EngineSpec.initialize({
  name: "Media archive",
  workspace: "./project",
  traceStore: { scheme: "file", value: "./trace-store" },
});

const snapshot = await engine.capture({
  selectors: [
    { type: "filesystem.directory", locator: { path: "." } },
  ],
});

await engine.commit({
  snapshotId: snapshot.id,
  ref: "heads/main",
  expectedHead: null,
  expectedGeneration: 0,
  author: { id: "local:developer" },
  message: "Initial capture",
});
```

`Repository` remains the AISpec v0 facade and is backward compatible.

## Install

After both packages are published:

```shell
npm install @enginespec/typescript-sdk
```

## Usage

```ts
import {
  Repository,
  type CreateCommitInput,
} from "@enginespec/typescript-sdk/aispec-v0";

const repository = Repository.create("./my-project", {
  name: "Example",
  author: "developer",
});
const node = repository.addNode({ id: "assistant", edges: [] });
const snapshot = repository.createSnapshot({
  nodeId: node.id,
  configuration: { model: "example-model" },
});
const input: CreateCommitInput = {
  message: "Add assistant state",
  author: "developer",
  snapshotIds: [snapshot.id],
};
repository.createCommit(input);
repository.saveRepository();
```

## Development

```shell
# Build the sibling Engine checkout before installing it locally.
npm --prefix ../aispec-engine install
npm --prefix ../aispec-engine run build
npm install --no-save --package-lock=false file:../aispec-engine
npm test
```

RFC-0009 and RFC-0010 remain Draft. Full JSON Schema conformance is also
blocked until the published schemas are populated.
