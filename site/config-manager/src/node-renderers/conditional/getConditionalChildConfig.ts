import { GetChildConfigFn } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";
import { getMatchingConfig } from "./getMatchingConfig";
import { pathUtils } from "@graphter/renderer-react";

export const getConditionalChildConfig: GetChildConfigFn = (configs, absolutePath, processingPath, treeData) => {
  if(!processingPath.length) return configs
  const localParentPath = absolutePath.slice(2, -1)
  const nodeConfig = configs[configs.length - 1]
  const targetPath = [...localParentPath, ...nodeConfig.options.siblingPath]
  const targetNodeData = pathUtils.getValue(treeData, targetPath)
  const matchingConfig = getMatchingConfig(nodeConfig, targetNodeData)
  if(!matchingConfig) return configs
  const matchingRendererRegistration = nodeRendererStore.get(matchingConfig.type)
  const newConfigs = [ ...configs, matchingConfig ]
  return matchingRendererRegistration.getChildConfig ?
    matchingRendererRegistration.getChildConfig(
      newConfigs,
      absolutePath,
      processingPath,
      treeData
    ) :
    newConfigs
}