import { NodeConfig, PathSegment } from "@graphter/core";
import { PathMeta } from "./PathMeta";

export interface TreeMetaCallbackHook {
  (
    fn: (meta: Array<PathMeta>) => void,
    config: NodeConfig,
    path: Array<PathSegment>,
    depth?: number
  ): () => void
}