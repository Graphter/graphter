import { NodeConfig, PathSegment } from "@graphter/core";

export interface TreeDataInitialiserHook {
  (): (config: NodeConfig, path: Array<PathSegment>, committed: boolean, originalTreeData?: any) => void
}