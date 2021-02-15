import { PathSegment } from "@graphter/core";

export interface ArrayNodeDataHook {
  (
    path: Array<PathSegment>
  ): {
    childIds: Array<string>,
    removeItem: (index: number) => void,
    commitItem: (index: number) => void
  }
}