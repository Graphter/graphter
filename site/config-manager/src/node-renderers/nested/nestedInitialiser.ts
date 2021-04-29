import { NodeDataInitialiserFn } from "@graphter/core";
import { isNestedConfig } from "./isNestedConfig";
import { getConfig, nodeRendererStore } from "@graphter/renderer-react";

export const nestedInitialiser: NodeDataInitialiserFn = async (
  originalTreeData,
  config,
  path
) => {
  if(!isNestedConfig(config)) throw new Error('Invalid config')
  const nodeMeta = {
    path,
    config,
  }

  const nestedConfig = getConfig(config.options.configId)
  if(!nestedConfig) throw new Error(`${config.type} type '${config.id}' cannot cannot find the nested config '${config.options.configId}'`)
  const nestedRendererReg = nodeRendererStore.get(nestedConfig.type)

  if(!nestedRendererReg.initialiser) return [ nodeMeta ]

  const childNodeMetas = await nestedRendererReg.initialiser(originalTreeData, nestedConfig, path)

  return [
    nodeMeta,
    ...childNodeMetas
  ]
}