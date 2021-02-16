import { GetChildConfigFn } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";

export const getListChildConfig: GetChildConfigFn = (config, path, absolutePath, treeData) => {
  if(!config.children) throw new Error(`List config must have exactly one child`)
  const pathConfig = { path, config }
  if(path.length === absolutePath.length) return [ pathConfig ]
  const childConfig = config.children[0]
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