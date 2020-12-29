import { GetChildPathsFn, PathSegment } from "@graphter/core";
import { pathConfigStore, nodeRendererStore } from "@graphter/renderer-react";

export const getChildPaths: GetChildPathsFn = async (path, getNodeValue) => {
  const childIds = await getNodeValue<Array<string>>(path)
  const results = await Promise.all(childIds.map(async (childId, i) => {
    const childPath: Array<PathSegment> = [ ...path, i ]
    const childConfig = pathConfigStore.get(childPath)
    if(!childConfig) throw new Error(`Couldn't find config for child node at path '${childPath.join('/')}'`)
    const childRenderer = nodeRendererStore.get(childConfig.type)
    if(!childRenderer.getChildPaths) return [ childPath ]
    return [ childPath, ...await childRenderer.getChildPaths(childPath, getNodeValue) ]
  }))
  return results.flat()
}