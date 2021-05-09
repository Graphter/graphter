import { NodeConfig, PathSegment } from "@graphter/core";

export interface NodeConfigsHook {
  (path: Array<PathSegment>): Array<NodeConfig>
}