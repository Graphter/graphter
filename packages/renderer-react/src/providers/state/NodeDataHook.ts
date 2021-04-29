import { NodeConfig, PathSegment } from "@graphter/core";

export interface NodeDataHook {
  (
    path: Array<PathSegment>,
    config: NodeConfig,
    originalTreeData: any
  ): [ any, (value: any) => void ]
}