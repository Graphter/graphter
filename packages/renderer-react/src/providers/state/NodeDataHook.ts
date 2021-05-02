import { NodeConfig, PathSegment } from "@graphter/core";

export interface NodeDataHook {
  <T = any>(
    path: Array<PathSegment>,
    config: NodeConfig,
    originalTreeData: any
  ): [ T, (value: T) => void ]
}