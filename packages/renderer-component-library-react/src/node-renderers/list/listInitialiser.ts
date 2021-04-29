import { NodeDataInitialiserFn } from "@graphter/core";
import { nanoid } from 'nanoid'
import { createDefault, pathUtils } from "@graphter/renderer-react";
import { nodeRendererStore } from "@graphter/renderer-react";
import { isListConfig } from "./isListConfig";

export const listInitialiser: NodeDataInitialiserFn = async (
  originalTreeData,
  config,
  path
) => {
  if(!isListConfig(config)) throw new Error('ListNodeRenderer received invalid config')
  const originalNodeData = pathUtils.getValueByGlobalPath(originalTreeData, path, createDefault(config, []))
  if(!Array.isArray(originalNodeData)) throw new Error(`List initialiser received unexpected original data type: ${JSON.stringify(originalNodeData)}`)
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

  if(!childRendererReg) throw new Error(`Couldn't find a renderer registration for type '${childConfig.type}'`)
  const childNodeMetas = (await Promise.all(originalNodeData.map((childData, i) => {
    const childPath = [ ...path, i ]
    if(childRendererReg?.initialiser) return childRendererReg?.initialiser(originalTreeData, childConfig, childPath)
    return Promise.resolve([ {
      path: childPath,
      config: childConfig,
      internalData: childData
    } ])
  }))).flat()

  return [
    nodeMeta,
    ...childNodeMetas
  ]

}