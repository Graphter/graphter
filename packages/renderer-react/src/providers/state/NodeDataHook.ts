import { NodeConfig, NodeRendererRegistration, PathSegment } from "@graphter/core";

export interface NodeDataHook {
  (
    path: Array<PathSegment>
  ): [ any, (value: any) => void ]
}