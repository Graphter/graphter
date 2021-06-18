import { NodeDataInitialiserFn } from "@graphter/core";
import { nanoid } from 'nanoid'
import { nodeRendererStore } from "@graphter/renderer-react";
import { isListConfig } from "./isListConfig";
import { createDefault } from '@graphter/renderer-react';

export const listInitialiser: NodeDataInitialiserFn = async (
  getBranchData,
  config,
  path
) => {
  if (!isListConfig(config)) throw new Error('ListNodeRenderer received invalid config')
  let originalNodeData = await getBranchData(path)
  if (typeof originalNodeData === 'undefined') {
    const rendererReg = nodeRendererStore.get(config.type)
    originalNodeData = await createDefault(config, rendererReg.createFallbackDefaultValue ? rendererReg.createFallbackDefaultValue(config, path, getBranchData) : null)
  }
  if (!Array.isArray(originalNodeData)) throw new Error(`List initialiser received unexpected original data type: ${JSON.stringify(originalNodeData)}`)
  const nodeMeta = {
    path,
    config,
    internalData: originalNodeData.map(item => ({
      item,
      key: nanoid(),
      committed: true,
      deleted: false
    }))
  }
  const childConfig = config.children[0]
  const childRendererReg = nodeRendererStore.get(childConfig.type)

  if (!childRendererReg) throw new Error(`Couldn't find a renderer registration for type '${childConfig.type}'`)
  const childNodeMetas = (await Promise.all(originalNodeData.map((childData, i) => {
    const childPath = [ ...path, i ]
    if (childRendererReg?.initialiser) return childRendererReg?.initialiser(getBranchData, childConfig, childPath)
    return Promise.resolve([
      {
        path: childPath,
        config: childConfig,
        internalData: childData
      }
    ])
  }))).flat()

  return [
    nodeMeta,
    ...childNodeMetas
  ]

}