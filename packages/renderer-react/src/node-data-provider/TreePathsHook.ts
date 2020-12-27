import { PathSegment } from "@graphter/core";

export interface TreePathsHook {
  (path: Array<PathSegment>): Array<Array<PathSegment>>
}