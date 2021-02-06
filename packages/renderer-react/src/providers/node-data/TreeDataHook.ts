import { NodeConfig, PathSegment } from "@graphter/core";

export interface TreeDataHook {
  (
    fn: (data: any) => void,
    config: NodeConfig,
    path: Array<PathSegment>,
  ): () => void
}