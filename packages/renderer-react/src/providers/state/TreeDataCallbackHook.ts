import { NodeConfig, PathSegment } from "@graphter/core";

export interface TreeDataCallbackHook {
  <T = any>(
    fn: (data: T) => void,
    path: Array<PathSegment>,
    depth?: number
  ): () => void
}