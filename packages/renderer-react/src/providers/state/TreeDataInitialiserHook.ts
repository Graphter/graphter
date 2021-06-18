import { NodeConfig, PathSegment } from "@graphter/core";

export interface TreeDataInitialiserHook {
  (): (
    config: NodeConfig,
    path: Array<PathSegment>,
    getBranchData?: <T>(path: Array<PathSegment>) => Promise<T | undefined>
  ) => Promise<void>
}