import { NodeConfig, PathSegment } from "@graphter/core";

export interface TreeDataCallbackHook {
  (
    fn: (data: any) => void,
    config: NodeConfig,
    path: Array<PathSegment>,
  ): () => void
}