import { GetChildDataFn } from "@graphter/core";
import { nodeRendererStore, pathConfigStore } from "@graphter/renderer-react";
import { getMatchingConfig } from "./getMatchingConfig";

export const getConditionalChildData: GetChildDataFn = (path, getNodeValue) => {
  const config = pathConfigStore.get(path)
  if (!config) throw new Error(`Couldn't find config for node at path '${path.join('/')}'`)
  if (!config.children?.length) throw new Error(`${config.type} type '${config.id}' has no children configured. Exactly one is required.`)
  if(config.children?.length > 1) throw new Error(`transparent ${config.type} type '${config.id}' has more than one child configured. Exactly one is required.`)
  if(!config.options?.siblingPath) throw new Error(`siblingPath option is required for conditional renderer.`)

  const targetPath = [...path.slice(0, -1), ...config.options.siblingPath]
  const targetNodeData = getNodeValue(targetPath)
  const matchingChildConfig = getMatchingConfig(config, targetNodeData)
  if(!matchingChildConfig){
    const defaultType = typeof config.options.defaultValue
    switch (defaultType){
      case 'undefined': return null
      case 'function': return typeof config.options.defaultValue()
      default: return typeof config.options.defaultValue
    }
  }
  const matchingChildPath = [ ...path, matchingChildConfig.id ]
  const matchingChildRenderer = nodeRendererStore.get(matchingChildConfig.type)
  console.info(`Transparently passing through matched conditional at ${matchingChildPath.join('/')}`)
  return matchingChildRenderer.getChildData ?
    matchingChildRenderer.getChildData(matchingChildPath, getNodeValue) :
    getNodeValue(matchingChildPath)
}