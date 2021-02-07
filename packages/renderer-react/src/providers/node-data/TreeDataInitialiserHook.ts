import { PathSegment } from "@graphter/core";

export interface TreeDataInitialiserHook {
  (): (path: Array<PathSegment>, originalTreeData: any) => void
}