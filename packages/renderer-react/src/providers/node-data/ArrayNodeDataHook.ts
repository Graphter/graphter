import { PathSegment } from "@graphter/core";

export interface ArrayNodeDataHook {
  (
    path: Array<PathSegment>,
    originalNodeData: Array<any>,
    committed: boolean,
  ): {
    childIds: Array<string>,
    removeItem: (index: number) => void,
    commitItem: (index: number) => void
  }
}