import { NewGetChildPathsFn } from "@graphter/core";
import { getMatchingNodeDetails } from "./getMatchingRendererRegistration";

export const newGetConditionalChildPaths: NewGetChildPathsFn = async (config, path, getNodeValue) => {
  const {
    matchingConfig,
    matchingRendererRegistration
  } = getMatchingNodeDetails(config, path, getNodeValue)
  if(!matchingRendererRegistration || !matchingConfig) return []
  return matchingRendererRegistration.newGetChildPaths ?
    matchingRendererRegistration.newGetChildPaths(matchingConfig, path, getNodeValue) :
    []
}