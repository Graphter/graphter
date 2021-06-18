import { PathSegment } from "@graphter/core";

export interface TreeDataCallbackHook {
  <Args extends ReadonlyArray<unknown>, T = any>(
    fn: (data: T, ...args: Args) => Promise<void>,
    path: Array<PathSegment>,
    depth?: number
  ): (...args: Args) => Promise<void>
}