import { MergeChildDataFn } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";
import { getMatchingNodeDetails } from "./getMatchingRendererRegistration";

export const mergeConditionalChildData:MergeChildDataFn = (config, path, getNodeValue, childData) => {
  const {
    matchingConfig,
    matchingRendererRegistration
  } = getMatchingNodeDetails(config, path, getNodeValue)
  if(!matchingRendererRegistration || !matchingConfig) return null
  const matchingRendererReg = nodeRendererStore.get(matchingConfig.type)
  return matchingRendererReg.mergeChildData ?
    matchingRendererReg.mergeChildData(matchingConfig, path, getNodeValue, childData) :
    null
}