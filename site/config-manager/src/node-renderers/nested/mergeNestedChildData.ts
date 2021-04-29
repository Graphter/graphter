import { MergeChildDataFn } from "@graphter/core";
import { isNestedConfig } from "./isNestedConfig";
import { getConfig, nodeRendererStore } from "@graphter/renderer-react";

export const mergeNestedChildData:MergeChildDataFn = async (config, path, internalNodeData, getExternalPathData, childData) => {
  if(!isNestedConfig(config)) throw new Error('Invalid config')
  const nestedConfig = getConfig(config.options.configId)
  if(!nestedConfig) throw new Error(`${config.type} type '${config.id}' cannot cannot find the nested config '${config.options.configId}'`)
  const nestedRendererReg = nodeRendererStore.get(nestedConfig.type)
  return nestedRendererReg.mergeChildData ?
    nestedRendererReg.mergeChildData(nestedConfig, path, internalNodeData, getExternalPathData, childData) :
    []
}