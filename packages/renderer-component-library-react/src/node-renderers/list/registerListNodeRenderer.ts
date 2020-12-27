import ListNodeRenderer from "./ListNodeRenderer";
import { NodeRendererRegistration, PathSegment } from "@graphter/core";
import { JsonType } from "@graphter/core";
import { pathConfigStore, nodeRendererStore } from "@graphter/renderer-react";

export interface ListNodeRendererOptions {
  type: string
}

export function registerListNodeRenderer(options: ListNodeRendererOptions): NodeRendererRegistration {
  const type = options?.type || 'list'
  return {
    type,
    jsonType: JsonType.ARRAY,
    getRenderedData: async (path, getNodeValue) => {
      const config = pathConfigStore.get(path)
      if(!config) throw new Error(`Couldn't find config for path ${path.join('/')}`)
      if(!config.children) throw new Error(`${type} type '${config.id}' has no children configured. At least one is required.`)
      const childIds = await getNodeValue<Array<string>>(path)
      return Promise.all(childIds.map((childId:string, i: number) => {
        const childPath = [ ...path, i ]
        const childConfig = pathConfigStore.get(path)
        if(!childConfig) throw new Error(`Couldn't find config for child node at path '${childPath.join('/')}'`)
        const childRenderer = nodeRendererStore.get(childConfig.type)
        return childRenderer.getRenderedData(childPath, getNodeValue)
      }))
    },
    getPaths: async (path, getNodeValue) => {
      const config = pathConfigStore.get(path)
      if(!config) throw new Error(`Couldn't find config for node at path '${path.join('/')}'`)
      if(!config.children) throw new Error(`${type} type '${config.id}' has no children configured. At least one is required.`)
      const childIds = await getNodeValue<Array<string>>(path)
      const results = await Promise.all(childIds.map(async (childId, i) => {
        const childPath = [ ...path, i ]
        const childConfig = pathConfigStore.get(childPath)
        if(!childConfig) throw new Error(`Couldn't find config for child node at path '${childPath.join('/')}'`)
        const childRenderer = nodeRendererStore.get(childConfig.type)
        if(!childRenderer.getPaths) return [ childPath ]
        return [ childPath, ...await childRenderer.getPaths(childPath, getNodeValue) ]
      }))
      return results.flat()
    },
    renderer: ListNodeRenderer,
    options
  }
}