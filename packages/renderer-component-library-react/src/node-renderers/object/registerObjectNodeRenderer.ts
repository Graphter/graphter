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
      if(!config.children || !config.children.length) throw new Error(`${type} type '${config.id}' has no children configured. At least one is required.`)

      const childValues = await Promise.all(config.children.map(child => {
        const childPath = [ ...path, child.id ]
        const childConfig = pathConfigStore.get(childPath)
        if(!childConfig) throw new Error(`Couldn't find config for child node at path '${childPath.join('/')}'`)
        const childRenderer = nodeRendererStore.get(childConfig.type)
        return childRenderer.getRenderedData(childPath, getNodeValue)
          .then(value => ({ key: child.id, value }))
      }))
      const reFormedObject = childValues.reduce<{ [key: string]: any }>((a, c) => {
        a[c.key] = c.value
        return a
      }, {})
      console.info(`Reformed ${childValues.length} child values for node '${config.id}'`, reFormedObject)
      return reFormedObject
    },
    getPaths: async (
      path: Array<PathSegment>,
      getNodeValue: (path: Array<PathSegment>) => Promise<any>
    ) => {
      const config = pathConfigStore.get(path)
      if(!config) throw new Error(`Couldn't find config for node at path '${path.join('/')}'`)
      if(!config.children || !config.children.length) throw new Error(`${type} type '${config.id}' has no children configured. At least one is required.`)
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
      console.info(`Found ${paths.length} paths for tree starting from '${path.join('/')}'`, paths)
      return paths
    },
    renderer: ObjectNodeRenderer,
    options
  }
}