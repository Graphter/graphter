import { NodeConfig, PathSegment } from "@graphter/core";

export interface TreeDataInitialiserHook {
  (): (config: NodeConfig, path: Array<PathSegment>, treeData: any) => Promise<void>
}