import { PathSegment } from "@graphter/core";

export interface ChildPathsHook {
  (
    path: Array<PathSegment>
  ): Array<Array<PathSegment>>
}