import { NodeConfig, PathSegment } from "@graphter/core";
import { PathMeta } from "./PathMeta";

export interface NodeConfigsHook {
  (path: Array<PathSegment>): [ Array<NodeConfig>, (configs: Array<NodeConfig>) => void ]
}