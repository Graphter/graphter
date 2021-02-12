import { GetChildConfigFn, NodeConfig } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";

export const getListChildConfig: GetChildConfigFn = (configs, absolutePath, processingPath, treeData) => {
  if(!processingPath.length) return configs
  const remainingPathToProcess = [ ...processingPath ]
  remainingPathToProcess.splice(0, 1)
  const config = configs[configs.length - 1]
  if(!config.children) throw new Error(`List config must have exactly one child`)
  const childConfig = config.children[0]
  const childRenderer = nodeRendererStore.get(childConfig.type)
  const newConfigs = [ ...configs, childConfig ]
  return childRenderer.getChildConfig ?
    childRenderer.getChildConfig(
      newConfigs,
      absolutePath,
      remainingPathToProcess,
      treeData
    ) :
    newConfigs
}