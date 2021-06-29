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
  let extractedExternalData = await getBranchData(path)
  if (typeof extractedExternalData === 'undefined') {
    const rendererReg = nodeRendererStore.get(config.type)
    extractedExternalData = await createDefault(config, rendererReg.createFallbackDefaultValue ? rendererReg.createFallbackDefaultValue(config, path, getBranchData) : null)
  }
  if (!Array.isArray(extractedExternalData)) throw new Error(`List initialiser received unexpected original data type: ${JSON.stringify(extractedExternalData)}`)
  const nodeMeta = {
    path,
    config,
    internalData: extractedExternalData.map(item => ({
      item,
      key: nanoid(),
      committed: true,
      deleted: false
    }))
  }
  const childConfig = config.children[0]
  const childRendererReg = nodeRendererStore.get(childConfig.type)

  if (!childRendererReg) throw new Error(`Couldn't find a renderer registration for type '${childConfig.type}'`)
  const childNodeMetas = (await Promise.all(extractedExternalData.map((childData, i) => {
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