import { GetChildPathsFn } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";
import { getMatchingConfig } from "./getMatchingConfig";

export const getConditionalChildPaths: GetChildPathsFn = (config, path, getNodeValue) => {
  if(!config) throw new Error(`Couldn't find config for node at path '${path.join('/')}'`)
  if (!config.children?.length) throw new Error(`${config.type} type '${config.id}' has no children configured. Exactly one is required.`)
  if(config.children?.length > 1) throw new Error(`transparent ${config.type} type '${config.id}' has more than one child configured. Exactly one is required.`)
  if(!config.options?.siblingPath) throw new Error(`siblingPath option is required for conditional renderer.`)
  const targetPath = [...path.slice(0, -1), ...config.options.siblingPath]
  const targetNodeData = getNodeValue(targetPath)
  const matchingChildConfig = getMatchingConfig(config, targetNodeData)
  if(!matchingChildConfig) return []
  const matchingChildRenderer = nodeRendererStore.get(matchingChildConfig.type)
  return matchingChildRenderer.getChildPaths ?
    matchingChildRenderer.getChildPaths(matchingChildConfig, [ ...path ], getNodeValue) :
    []
}