import {
  Repository,
  type AISpecNode,
  type CreateCommitInput,
  type ValidationResult,
} from "@iaspec/typescript-sdk";

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
