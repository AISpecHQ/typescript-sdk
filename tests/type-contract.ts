import {
  Repository,
  EngineSpec,
  type AISpecNode,
  type CreateCommitInput,
  type ValidationResult,
} from "@enginespec/typescript-sdk";

const typeCheck = (repository: ReturnType<typeof Repository.create>): ValidationResult => {
  const node: AISpecNode = { id: "assistant", edges: [] };
  repository.addNode(node);
  const snapshot = repository.createSnapshot({
    nodeId: node.id,
    configuration: { model: "example" },
  });
  const input: CreateCommitInput = {
    message: "Add assistant state",
    author: "test",
    snapshotIds: [snapshot.id],
  };
  repository.createCommit(input);
  return repository.validate();
};

void typeCheck;

async function checkEngineSpec(): Promise<void> {
  const engine = await EngineSpec.initialize({
    name: "Type contract",
    workspace: "./workspace",
    traceStore: { scheme: "file", value: "./trace" },
  });
  const snapshot = await engine.capture({
    selectors: [{
      type: "structured.json",
      locator: { resourceId: "settings", state: { enabled: true } },
    }],
  });
  await engine.commit({
    snapshotId: snapshot.id,
    ref: "heads/main",
    expectedHead: null,
    expectedGeneration: 0,
    author: { id: "local:typecheck" },
    message: "Initial",
  });
}

void checkEngineSpec;
