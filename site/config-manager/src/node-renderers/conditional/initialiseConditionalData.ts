import { InitialiseNodeDataFn, PathSegment } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";
import { pathUtils } from "@graphter/renderer-react";
import { getMatchingConfig } from "./getMatchingConfig";
import { isConditionalConfig } from "./isConditionalConfig";

const NoMatch = 'no-match-4acbdcce-9225-4fee-b845-7159110763eb'

export const initialiseConditionalData:InitialiseNodeDataFn = (config, path, initialise, originalTreeData) => {
  if(!isConditionalConfig(config)) throw new Error()
  const localParentPath = path.slice(2, -1)
  const targetPath = [...localParentPath, ...config.options.siblingPath]
  const targetNodeData = pathUtils.getValue(originalTreeData, targetPath, NoMatch)
  if(targetNodeData === NoMatch) return
  const matchingConfig = getMatchingConfig(config, targetNodeData)
  if(!matchingConfig) return
  const transparentPath: Array<PathSegment> = [ ...path ]
  const matchingRendererRegistration = nodeRendererStore.get(matchingConfig.type)
  matchingRendererRegistration.initialiseData(matchingConfig, transparentPath, initialise, originalTreeData)
}