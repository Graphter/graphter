import { InitialiseNodeDataFn, PathSegment } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";
import { pathUtils } from "@graphter/renderer-react";
import { getMatchingConfig } from "./getMatchingConfig";

export const initialiseConditionalData:InitialiseNodeDataFn = (config, path, originalTreeData, initialise) => {
  const localParentPath = path.slice(2, -1)
  const targetPath = [...localParentPath, ...config.options.siblingPath]
  const targetNodeData = pathUtils.getValue(originalTreeData, targetPath)
  const matchingConfig = getMatchingConfig(config, targetNodeData)
  if(!matchingConfig) return
  const transparentPath: Array<PathSegment> = [ ...path ]
  const matchingRendererRegistration = nodeRendererStore.get(matchingConfig.type)
  matchingRendererRegistration.initialiseData ?
    matchingRendererRegistration.initialiseData(matchingConfig, transparentPath, originalTreeData, initialise) :
    initialise(transparentPath, pathUtils.getValue(originalTreeData, transparentPath.slice(2)))
}