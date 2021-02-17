 import { GetChildDataFn } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";

export const getListChildData: GetChildDataFn = (config, path, getNodeValue) => {
  if(!config.children?.length) throw new Error('List renderer has incorrect number of child configs')
  const childConfig = config.children[0]
  const childIds = getNodeValue<Array<string>>(path)
  return childIds.map((childId:string, i: number) => {
    const childPath = [ ...path, i ]
    const childRenderer = nodeRendererStore.get(childConfig.type)
    return childRenderer.getChildData ?
      childRenderer.getChildData(childConfig, childPath, getNodeValue) :
      getNodeValue(childPath)
  })
}