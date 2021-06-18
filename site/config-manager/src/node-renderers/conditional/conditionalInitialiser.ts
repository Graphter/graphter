import { NodeDataInitialiserFn } from "@graphter/core";
import { getMatchingNodeDetails } from "./getMatchingRendererRegistration";

export const conditionalInitialiser: NodeDataInitialiserFn = async (
  getBranchData,
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
  } = await getMatchingNodeDetails(config, path, getBranchData)

  if(!matchingRendererRegistration?.initialiser || !matchingConfig) return [ nodeMeta ]

  const childNodeMetas = await matchingRendererRegistration.initialiser(getBranchData, matchingConfig, path)

  return [
    nodeMeta,
    ...childNodeMetas
  ]
}