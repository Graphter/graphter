import { GetChildPathsFn, PathSegment } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";

export const getListChildPaths: GetChildPathsFn = (config, path, getNodeValue) => {
  if(!config.children?.length) throw new Error('List renderer has incorrect number of child configs')
  const childConfig = config.children[0]
  const childIds = getNodeValue<Array<string>>(path)
  const results = childIds.map((childId, i) => {
    const childPath: Array<PathSegment> = [ ...path, i ]
    const childRenderer = nodeRendererStore.get(childConfig.type)
    if(!childRenderer.getChildPaths) return [ childPath ]
    return [ childPath, ...childRenderer.getChildPaths(childConfig, childPath, getNodeValue) ]
  })
  return results.flat()
}