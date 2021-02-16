import { GetChildConfigFn } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";
import { getConfig } from "@graphter/renderer-react";

export const getNestedChildConfig: GetChildConfigFn = (config, path, absolutePath, treeData) => {
  const pathConfig = { path, config }
  if(path.length === absolutePath.length) return [ pathConfig ]
  const nestedConfig = getConfig(config.options.configId)
  if(!nestedConfig) throw new Error(`${config.type} type '${config.id}' cannot cannot find the nested config '${config.options.configId}'`)
  const nestedRendererRegistration = nodeRendererStore.get(nestedConfig.type)
  if(nestedRendererRegistration.getChildConfig){
    return [ pathConfig, ...nestedRendererRegistration.getChildConfig(
      nestedConfig,
      [ ...path ],
      absolutePath,
      treeData
    )]
  }
  return [ pathConfig ]
}