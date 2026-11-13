# AISpec TypeScript SDK

Status: under development.

The TypeScript SDK is a thin, typed entry point to `@aispechq/engine`. It
re-exports the Engine API instead of maintaining a second implementation of
repository and history rules. `Repository` is an alias for `AISpecEngine`.

The Engine package must be published before this SDK can be published because
it is a runtime dependency.

## Install

After both packages are published:

```shell
npm install @aispechq/typescript-sdk
```

## Usage

```ts
import { Repository, type CreateCommitInput } from "@aispechq/typescript-sdk";

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
