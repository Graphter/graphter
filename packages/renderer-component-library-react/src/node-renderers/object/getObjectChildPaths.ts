import { GetChildPathsFn } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";

export const getObjectChildPaths: GetChildPathsFn = (config, path, getNodeValue) => {
  if(!config.children?.length) throw new Error(`${config.type} type '${config.id}' has no children configured. At least one is required.`)
  const results = config.children.map(childConfig => {
    const childPath = [ ...path, childConfig.id ]
    const childRenderer = nodeRendererStore.get(childConfig.type)
    if(!childRenderer.getChildPaths) return [ childPath ]
    return [ childPath, ...childRenderer.getChildPaths(childConfig, childPath, getNodeValue) ]
  })
  const paths = results.flat()
  console.info(`Found ${paths.length} paths for tree starting from '${path.join('/')}'`, paths)
  return paths
}