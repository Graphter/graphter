import { PathSegment } from "@graphter/core";

export interface TreeDataHook {
  <T = any>(
    path: Array<PathSegment>,
    depth?: number
  ): T
}