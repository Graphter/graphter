import { MergeChildDataFn } from "@graphter/core";
import { isConditionalConfig } from "./isConditionalConfig";
import { getMatchingConfig } from "./getMatchingConfig";
import { nodeRendererStore } from "@graphter/renderer-react";

export const mergeConditionalChildData:MergeChildDataFn = (config, path, getNodeValue, childData) => {
  if(!isConditionalConfig(config)) throw new Error('Invalid config')
  const targetPath = [...path.slice(0, -1), ...config.options.siblingPath]
  const targetData = getNodeValue(targetPath)
  const matchingConfig = getMatchingConfig(config, targetData)
  if(!matchingConfig) return null
  const matchingRendererReg = nodeRendererStore.get(matchingConfig.type)
  return matchingRendererReg.mergeChildData ?
    matchingRendererReg.mergeChildData(matchingConfig, path, getNodeValue, childData) :
    null
}