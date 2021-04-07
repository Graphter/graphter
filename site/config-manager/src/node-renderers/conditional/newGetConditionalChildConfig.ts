import { NewGetChildConfigFn } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";
import { getMatchingNodeDetails } from "./getMatchingRendererRegistration";

export const newGetConditionalChildConfig: NewGetChildConfigFn = async (config, path, childSegment, getNodeValue) => {
  const {
    matchingConfig,
    matchingRendererRegistration
  } = getMatchingNodeDetails(config, path, getNodeValue)
  if(!matchingRendererRegistration || !matchingConfig) return null
  const matchingRendererReg = nodeRendererStore.get(matchingConfig.type)
  return matchingRendererReg.newGetChildConfig ?
    matchingRendererReg.newGetChildConfig(matchingConfig, path, childSegment, getNodeValue) :
    null
}