import { NodeConfig, PathSegment } from "@graphter/core";

export interface TreeDataInitialiserHook {
  (): (config: NodeConfig, path: Array<PathSegment>, originalTreeData: any) => Promise<void>
}