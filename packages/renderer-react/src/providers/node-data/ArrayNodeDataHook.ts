import { NodeConfig, PathSegment } from "@graphter/core";

export interface ArrayNodeDataHook {
  (
    path: Array<PathSegment>,
    config: NodeConfig,
    originalNodeData: Array<any>,
    committed: boolean,
  ): {
    childIds: Array<string>,
    removeItem: (index: number) => void,
    commitItem: (index: number) => void
  }
}