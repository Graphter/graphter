import { GetChildDataFn } from "@graphter/core";
import { pathConfigStore, nodeRendererStore } from "@graphter/renderer-react";

export const getObjectChildData: GetChildDataFn = (path, getNodeValue) => {
  const config = pathConfigStore.get(path)
  if (!config) throw new Error(`Couldn't find config for node at path '${path.join('/')}'`)
  if (!config.children || !config.children.length) throw new Error(`${config.type} type '${config.id}' has no children configured. At least one is required.`)

  const childValues = config.children.map(childConfig => {
    const childPath = [ ...path, childConfig.id ]
    const childRenderer = nodeRendererStore.get(childConfig.type)
    const nodeData = childRenderer.getChildData ?
      childRenderer.getChildData(childPath, getNodeValue) :
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