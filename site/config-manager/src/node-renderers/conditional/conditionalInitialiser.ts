import { NodeDataInitialiserFn } from "@graphter/core";
import { getMatchingNodeDetails } from "./getMatchingRendererRegistration";
import { pathUtils } from "@graphter/renderer-react";

export const conditionalInitialiser: NodeDataInitialiserFn = async (
  originalTreeData,
  config,
  path
) => {
  const {
    matchingConfig,
    matchingRendererRegistration
  } = getMatchingNodeDetails(config, path, (path) => {
    return pathUtils.getValueByGlobalPath(originalTreeData, path, null)
  })
  if(!matchingRendererRegistration || !matchingConfig) return
  return matchingRendererRegistration.initialiser ?
    matchingRendererRegistration.initialiser(originalTreeData, config, path) :
    pathUtils.getValueByGlobalPath(originalTreeData, path)
}