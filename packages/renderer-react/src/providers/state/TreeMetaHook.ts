import { NodeConfig, PathSegment } from "@graphter/core";
import { PathMeta } from "./PathMeta";

export interface TreeMetaHook {
  (config: NodeConfig, path: Array<PathSegment>): Array<PathMeta>
}