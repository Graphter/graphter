import { NodeConfig, PathSegment } from "@graphter/core";

export interface TreeDataHook {
  (
    config: NodeConfig,
    path: Array<PathSegment>,
  ): () => void
}