import { GetChildDataFn } from "@graphter/core";
import { pathConfigStore, nodeRendererStore } from "@graphter/renderer-react";

export const getChildData: GetChildDataFn = async (path, getNodeValue) => {
  const childIds = await getNodeValue<Array<string>>(path)
  return Promise.all(childIds.map((childId:string, i: number) => {
    const childPath = [ ...path, i ]
    const childConfig = pathConfigStore.get(childPath)
    if(!childConfig) throw new Error(`Couldn't find config for child node at path '${childPath.join('/')}'`)
    const childRenderer = nodeRendererStore.get(childConfig.type)
    return childRenderer.getChildData ?
      childRenderer.getChildData(childPath, getNodeValue) :
      getNodeValue(childPath)
  }))
}