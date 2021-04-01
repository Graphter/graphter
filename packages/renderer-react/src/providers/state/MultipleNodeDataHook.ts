import { PathSegment } from "@graphter/core";

export interface MultipleNodeDataHook {
  (
    paths: Array<Array<PathSegment>>
  ): Array<{ path: Array<PathSegment>, data: any }>
}