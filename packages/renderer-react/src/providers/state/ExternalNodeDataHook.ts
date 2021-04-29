import { PathSegment } from "@graphter/core";

export interface ExternalNodeDataHook {
  (
    path: Array<PathSegment>
  ): [ any, (value: any) => void ]
}