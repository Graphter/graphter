import { isConditionalConfig } from "./isConditionalConfig";
import { getMatchingConfig } from "./getMatchingConfig";
import { NodeConfig, PathSegment } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";

export const getMatchingNodeDetails =
  (
    config: NodeConfig,
    path: Array<PathSegment>,
    getNodeValue: <T>(path: Array<PathSegment>) => T
  ) => {
  if(!isConditionalConfig(config)) throw new Error('Invalid config')
  const targetPath = [...path.slice(0, -1), ...config.options.siblingPath]
  const targetData = getNodeValue(targetPath)
  const matchingConfig = getMatchingConfig(config, targetData)
  if(!matchingConfig) return {}
  const matchingRendererRegistration = nodeRendererStore.get(matchingConfig.type)
  return {
    matchingConfig,
    matchingRendererRegistration
  }
}