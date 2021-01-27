import { GetChildPathsFn } from "@graphter/core";
import { nodeRendererStore, pathConfigStore } from "@graphter/renderer-react";
import { getMatchingConfig } from "./getMatchingConfig";

export const getConditionalChildPaths1: GetChildPathsFn = async (path, getNodeValue) => {
  const config = pathConfigStore.get(path)
  if(!config) throw new Error(`Couldn't find config for node at path '${path.join('/')}'`)
  if (!config.children?.length) throw new Error(`${config.type} type '${config.id}' has no children configured. Exactly one is required.`)
  if(config.children?.length > 1) throw new Error(`transparent ${config.type} type '${config.id}' has more than one child configured. Exactly one is required.`)
  if(!config.options?.siblingPath) throw new Error(`siblingPath option is required for conditional renderer.`)
  const targetPath = [...path.slice(0, -1), ...config.options.siblingPath]
  const targetNodeData = await getNodeValue(targetPath)
  //const targetNodeData = 'object'
  const matchingChildConfig = getMatchingConfig(config, targetNodeData)
  if(!matchingChildConfig) return []
  const matchingChildRenderer = nodeRendererStore.get(matchingChildConfig.type)
  return matchingChildRenderer.getChildPaths ?
    await matchingChildRenderer.getChildPaths([ ...path, matchingChildConfig.id ], getNodeValue) :
    []
}

export const getConditionalChildPaths: GetChildPathsFn = async (path, getNodeValue) => {
  const config = pathConfigStore.get(path)
  if(!config) throw new Error(`Couldn't find config for node at path '${path.join('/')}'`)
  if(!config.children || !config.children.length) throw new Error(`${config.type} type '${config.id}' has no children configured. At least one is required.`)
  if(!config.options?.siblingPath) throw new Error(`siblingPath option is required for conditional renderer.`)
  const targetPath = [...path.slice(0, -1), ...config.options.siblingPath]
  const targetNodeData = 'object'
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