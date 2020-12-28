import ObjectNodeRenderer from "./ObjectNodeRenderer";
import { NodeRendererRegistration, PathSegment } from "@graphter/core";
import { pathConfigStore, nodeRendererStore } from "@graphter/renderer-react";

export interface ObjectNodeRendererOptions {
  type: string
}

export function registerObjectNodeRenderer(options: ObjectNodeRendererOptions): NodeRendererRegistration {
  const type = options?.type || 'object'
  return {
    type: type,
    getRenderedData: async (
      path: Array<PathSegment>,
      getNodeValue: (path: Array<PathSegment>) => Promise<any>
    ) => {
      const config = pathConfigStore.get(path)
      if(!config) throw new Error(`Couldn't find config for node at path '${path.join('/')}'`)
      if(!config.children) throw new Error(`${type} type '${config.id}' has no children configured. At least one is required.`)
      return config.children?.reduce<{ [key: string]: any }>(async (a, c) => {
        const childPath = [ ...path, c.id ]
        const childConfig = pathConfigStore.get(path)
        if(!childConfig) throw new Error(`Couldn't find config for child node at path '${childPath.join('/')}'`)
        const childRenderer = nodeRendererStore.get(childConfig.type)
        a[c.id] = await childRenderer.getRenderedData(childPath, getNodeValue)
        return a
      }, {})
    },
    getPaths: async (
      path: Array<PathSegment>,
      getNodeValue: (path: Array<PathSegment>) => Promise<any>
    ) => {
      const config = pathConfigStore.get(path)
      if(!config) throw new Error(`Couldn't find config for node at path '${path.join('/')}'`)
      if(!config.children) throw new Error(`${type} type '${config.id}' has no children configured. At least one is required.`)
      const promises = config.children.map(async child => {
        const childPath = [ ...path, child.id ]
        const childConfig = pathConfigStore.get(childPath)
        if(!childConfig) throw new Error(`Couldn't find config for child node at path '${childPath.join('/')}'`)
        const childRenderer = nodeRendererStore.get(childConfig.type)
        if(!childRenderer.getPaths) return [ childPath ]
        return [ childPath, ...await childRenderer.getPaths(childPath, getNodeValue) ]
      })
      const results = await Promise.all(promises)
      const paths = results.flat()
      console.log(`Found ${paths.length} paths for tree starting from '${path.join('/')}'`, paths)
      return paths
    },
    renderer: ObjectNodeRenderer,
    options
  }
}