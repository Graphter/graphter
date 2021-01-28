import { GetChildPathsFn } from "@graphter/core";
import { pathConfigStore, nodeRendererStore } from "@graphter/renderer-react";

export const getObjectChildPaths: GetChildPathsFn = (path, getNodeValue) => {
  const config = pathConfigStore.get(path)
  if(!config) throw new Error(`Couldn't find config for node at path '${path.join('/')}'`)
  if(!config.children || !config.children.length) throw new Error(`${config.type} type '${config.id}' has no children configured. At least one is required.`)
  const results = config.children.map(childConfig => {
    const childPath = [ ...path, childConfig.id ]
    const childRenderer = nodeRendererStore.get(childConfig.type)
    if(!childRenderer.getChildPaths) return [ childPath ]
    return [ childPath, ...childRenderer.getChildPaths(childPath, getNodeValue) ]
  })
  const paths = results.flat()
  console.info(`Found ${paths.length} paths for tree starting from '${path.join('/')}'`, paths)
  return paths
}