import { NodeConfig, PathSegment } from "@graphter/core";

export interface TreeDataHook {
  (
    fn: (data: any) => void,
    path: Array<PathSegment>,
  ): () => void
}