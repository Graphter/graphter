import { GetChildPathsFn } from "@graphter/core";
import { pathConfigStore, nodeRendererStore } from "@graphter/renderer-react";

export const getChildPaths: GetChildPathsFn = async (path, getNodeValue) => {
  const config = pathConfigStore.get(path)
  if(!config) throw new Error(`Couldn't find config for node at path '${path.join('/')}'`)
  if(!config.children || !config.children.length) throw new Error(`${config.type} type '${config.id}' has no children configured. At least one is required.`)
  const promises = config.children.map(async childConfig => {
    const childPath = [ ...path, childConfig.id ]
    const childRenderer = nodeRendererStore.get(childConfig.type)
    if(!childRenderer.getChildPaths) return [ childPath ]
    return [ childPath, ...await childRenderer.getChildPaths(childPath, getNodeValue) ]
  })
  const results = await Promise.all(promises)
  const paths = results.flat()
  console.info(`Found ${paths.length} paths for tree starting from '${path.join('/')}'`, paths)
  return paths
}