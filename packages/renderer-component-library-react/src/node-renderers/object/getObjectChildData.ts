import { GetChildDataFn } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";

/**
 * Common uses:
 * - init: config + path + tree data -> calls to init fn ->
 *
 * - defaulting: original value -> defaulted value ->
 *
 * - data re-composition: config + path -> tree data ->
 *
 * - path listing: config + path -> tree paths ->
 * - path listing: recomposed data -> tree paths ->
 *
 * - path config resolution: config + path -> end node config ->
 *
 *
 * @param config
 * @param path
 * @param getNodeValue
 */


export const getObjectChildData: GetChildDataFn = (config, path, getNodeValue) => {
  if (!config.children?.length) throw new Error(`${config.type} type '${config.id}' has no children configured. At least one is required.`)

  const childValues = config.children.map(childConfig => {
    const childPath = [ ...path, childConfig.id ]
    const childRenderer = nodeRendererStore.get(childConfig.type)
    const nodeData = childRenderer.getChildData ?
      childRenderer.getChildData(childConfig, childPath, getNodeValue) :
      getNodeValue(childPath)
    return { key: childConfig.id, value: nodeData }
  })
  const reFormedObject = childValues.reduce<{ [key: string]: any }>((a, c) => {
    a[c.key] = c.value
    return a
  }, {})
  console.info(`Reformed ${childValues.length} child values for node '${config.id}'`, reFormedObject)
  return reFormedObject
}