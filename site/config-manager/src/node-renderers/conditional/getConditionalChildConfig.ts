import { GetChildConfigFn } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";
import { getMatchingConfig } from "./getMatchingConfig";
import { pathUtils } from "@graphter/renderer-react";

export const getConditionalChildConfig: GetChildConfigFn = (config, path, absolutePath, treeData) => {
  if(!config.children?.length) throw new Error('Conditional config must have one or more children')
  const pathConfig = { path, config }
  if(path.length === absolutePath.length) return [ pathConfig ]
  const localParentPath = absolutePath.slice(2, -1)
  const targetPath = [...localParentPath, ...config.options.siblingPath]
  const targetNodeData = pathUtils.getValue(treeData, targetPath)
  const matchingConfig = getMatchingConfig(config, targetNodeData)
  if(!matchingConfig) return [ pathConfig ]
  const matchingRendererRegistration = nodeRendererStore.get(matchingConfig.type)
  if(matchingRendererRegistration.getChildConfig){
    return [ pathConfig, ...matchingRendererRegistration.getChildConfig(
      matchingConfig,
      [ ...path ],
      absolutePath,
      treeData
    )]
  }
  return [ pathConfig ]
}