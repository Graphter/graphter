import { NodeDataInitialiserFn } from "@graphter/core";
import { getMatchingNodeDetails } from "./getMatchingRendererRegistration";
import { pathUtils } from "@graphter/renderer-react";

export const conditionalInitialiser: NodeDataInitialiserFn = async (
  originalTreeData,
  config,
  path
) => {
  const nodeMeta = {
    path,
    config
  }

  const {
    matchingConfig,
    matchingRendererRegistration
  } = await getMatchingNodeDetails(config, path, (path) => {
    return pathUtils.getValueByGlobalPath(originalTreeData, path, null)
  })

  if(!matchingRendererRegistration?.initialiser || !matchingConfig) return [ nodeMeta ]

  const childNodeMetas = await matchingRendererRegistration.initialiser(originalTreeData, matchingConfig, path)

  return [
    nodeMeta,
    ...childNodeMetas
  ]
}