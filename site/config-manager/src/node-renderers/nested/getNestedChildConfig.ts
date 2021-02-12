import { GetChildConfigFn } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";
import { getConfig } from "@graphter/renderer-react";

export const getNestedChildConfig: GetChildConfigFn = (configs, absolutePath, processingPath, treeData) => {
  if(!processingPath.length) return configs
  const config = configs[configs.length - 1]
  const nestedConfig = getConfig(config.options.configId)
  if(!nestedConfig) throw new Error(`${config.type} type '${config.id}' cannot cannot find the nested config '${config.options.configId}'`)
  const nestedRenderer = nodeRendererStore.get(nestedConfig.type)
  const newConfigs = [ ...configs, nestedConfig ]
  return nestedRenderer.getChildConfig ?
    nestedRenderer.getChildConfig(
      newConfigs,
      absolutePath,
      processingPath,
      treeData
    ) :
    newConfigs
}