import { NodeDataInitialiserFn } from "@graphter/core";
import { createDefault, pathUtils } from "@graphter/renderer-react";
import { nodeRendererStore } from "@graphter/renderer-react";
import { isObjectConfig } from "./isObjectConfig";

export const objectInitialiser: NodeDataInitialiserFn = async (
  getBranchData,
  config,
  path
) => {
  if(!isObjectConfig(config)) throw new Error('ObjectNodeRenderer received invalid config')
  let extractedExternalData = await getBranchData(path)

  const rendererReg = nodeRendererStore.get(config.type)
  const externalNodeData: { [key: string]: any } = typeof extractedExternalData === 'undefined' ?
    createDefault(config, rendererReg.createFallbackDefaultValue ? rendererReg.createFallbackDefaultValue(config, path, getBranchData) : null) :
    extractedExternalData

  const nodeMeta = {
    path,
    config,
    internalData: externalNodeData
  }

  if(externalNodeData === null){
    return [ nodeMeta ]
  }

  const childNodeMetas =  (await Promise.all(config.children.map((childConfig) => {
    const childRendererReg = nodeRendererStore.get(childConfig.type)
    const childPath = [ ...path, childConfig.id ]
    if(childRendererReg?.initialiser) return childRendererReg.initialiser(getBranchData, childConfig, childPath)
    const childPathMeta = {
      path: childPath,
      config: childConfig,
      internalData: externalNodeData[childConfig.id]
    }
    return Promise.resolve([ childPathMeta ])
  }))).flat()

  return [
    nodeMeta,
    ...childNodeMetas
  ]

}