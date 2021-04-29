import { isConditionalConfig } from "./isConditionalConfig";
import { getMatchingConfig } from "./getMatchingConfig";
import { NodeConfig, PathSegment } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";

export const getMatchingNodeDetails =
  async (
    config: NodeConfig,
    path: Array<PathSegment>,
    getNodeValue: <T>(path: Array<PathSegment>) => Promise<T>
  ) => {
  if(!isConditionalConfig(config)) throw new Error('Invalid config')
  const targetPath = [...path.slice(0, -1), ...config.options.siblingPath]
  const targetData = await getNodeValue(targetPath)
  const matchingConfig = getMatchingConfig(config, targetData)
  if(!matchingConfig) return {}
  const matchingRendererRegistration = nodeRendererStore.get(matchingConfig.type)
  return {
    matchingConfig,
    matchingRendererRegistration
  }
}