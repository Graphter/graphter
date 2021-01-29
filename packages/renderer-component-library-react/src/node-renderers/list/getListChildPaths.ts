import { GetChildPathsFn, PathSegment } from "@graphter/core";
import { pathConfigStore, nodeRendererStore } from "@graphter/renderer-react";

export const getListChildPaths: GetChildPathsFn = (path, getNodeValue) => {
  const childIds = getNodeValue<Array<string>>(path)
  const results = childIds.map((childId, i) => {
    const childPath: Array<PathSegment> = [ ...path, i ]
    const childConfig = pathConfigStore.get(childPath)
    if(!childConfig) throw new Error(`Couldn't find config for child node at path '${childPath.join('/')}'`)
    const childRenderer = nodeRendererStore.get(childConfig.type)
    if(!childRenderer.getChildPaths) return [ childPath ]
    return [ childPath, ...childRenderer.getChildPaths(childPath, getNodeValue) ]
  })
  return results.flat()
}