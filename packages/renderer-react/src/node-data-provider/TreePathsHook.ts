import { NodeConfig, PathSegment } from "@graphter/core";

export interface TreePathsHook {
  (config: NodeConfig, path: Array<PathSegment>): Array<Array<PathSegment>>
}