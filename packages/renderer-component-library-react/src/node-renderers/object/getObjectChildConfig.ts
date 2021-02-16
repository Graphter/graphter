import { GetChildConfigFn, NodeConfig } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";

export const getObjectChildConfig: GetChildConfigFn = (config, path, absolutePath, treeData) => {
  if(!config.children?.length) throw new Error('Object config must have one or more children')
  const pathConfig = { path, config }
  if(path.length === absolutePath.length) return [ pathConfig ]
  const nextSegment = absolutePath[path.length]
  const childConfig = config.children?.find((childConfig: NodeConfig) => childConfig.id === nextSegment)
  if(!childConfig) throw new Error(`Couldn't find child config '${nextSegment}' at ${path.join('/')}`)
  const childRendererRegistration = nodeRendererStore.get(childConfig.type)
  if(childRendererRegistration.getChildConfig){
    return [ pathConfig, ...childRendererRegistration.getChildConfig(
      childConfig,
      [ ...path, absolutePath[path.length] ],
      absolutePath,
      treeData
    )]
  }
  return [ pathConfig ]
}