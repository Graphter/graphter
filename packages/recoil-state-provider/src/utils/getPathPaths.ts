import { PathSegment } from "@graphter/core";

export const getPathPaths = (path: Array<PathSegment>): Array<Array<PathSegment>> => {
  if(path.length < 2) return []
  return path.slice(2).reduce<Array<Array<PathSegment>>>((a, c) => {
    a.push([ ...a[a.length - 1], c ])
    return a
  }, [ path.slice(0, 2) ])
}