import { GetChildConfigFn } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";
import { getMatchingConfig } from "./getMatchingConfig";
import { pathUtils } from "@graphter/renderer-react";
import { isConditionalConfig } from "./isConditionalConfig";

export const getConditionalChildConfig: GetChildConfigFn = (config, path, absolutePath, treeData) => {
  if(!config.children?.length) throw new Error('Conditional config must have one or more children')
  const pathConfig = { path, config }
  if(path.length === absolutePath.length) return [ pathConfig ]
  const targetPath = [...absolutePath, ...config.options.siblingPath]
  const targetNodeData = pathUtils.getValue(treeData, targetPath)
  if(!isConditionalConfig(config)) throw new Error()
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