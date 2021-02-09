import { NodeConfig, NodeRendererRegistration, PathSegment } from "@graphter/core";

export interface NodeDataHook {
  (
    path: Array<PathSegment>,
    originalNodeData: any,
    committed: boolean,
  ): [ any, (value: any) => void ]
}