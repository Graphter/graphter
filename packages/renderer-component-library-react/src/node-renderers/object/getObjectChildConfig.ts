import { GetChildConfigFn, NodeConfig } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";

export const getObjectChildConfig: GetChildConfigFn = (configs, absolutePath, processingPath, treeData) => {
  if(!processingPath.length) return configs
  const remainingPathToProcess = [ ...processingPath ]
  const nextSegment = remainingPathToProcess.splice(0, 1)[0]
  const config = configs[configs.length - 1]
  const childConfig = config.children?.find((childConfig: NodeConfig) => childConfig.id === nextSegment)
  if(!childConfig) throw new Error(`Couldn't find child config at ${configs.map(config => config.id).join('/')}`)
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