import { NodeDataInitialiserFn } from "@graphter/core";
import { createDefault, pathUtils } from "@graphter/renderer-react";
import { nodeRendererStore } from "@graphter/renderer-react";
import { isObjectConfig } from "./isObjectConfig";

export const objectInitialiser: NodeDataInitialiserFn = async (
  originalTreeData,
  config,
  path
) => {
  if(!isObjectConfig(config)) throw new Error('ObjectNodeRenderer received invalid config')
  const originalNodeData = pathUtils.getValueByGlobalPath(originalTreeData, path, createDefault(config, {}))
  const nodeMeta = {
    path,
    config,
    internalData: originalNodeData
  }

  const childNodeMetas = (await Promise.all(config.children.map((childConfig) => {
    const childRendererReg = nodeRendererStore.get(childConfig.type)
    const childPath = [ ...path, childConfig.id ]
    if(childRendererReg?.initialiser) return childRendererReg.initialiser(originalTreeData, childConfig, childPath)
    const childPathMeta = {
      path: childPath,
      config: childConfig,
      internalData: originalNodeData[childConfig.id]
    }
    return Promise.resolve([ childPathMeta ])
  }))).flat()

  return [
    nodeMeta,
    ...childNodeMetas
  ]

}