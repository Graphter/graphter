import { NodeConfig, PathSegment } from "@graphter/core";
import clone from "rfdc";
import nodeRendererStore from "../store/nodeRendererStore";

export function createDefault(config: NodeConfig, fallbackValue: any = undefined): any{
  const defaultType = typeof config.default;
  if(defaultType === 'undefined'){
    if(typeof fallbackValue === 'undefined'){
      throw new Error(`A default value is required by the '${config.id}' model`)
    }
    return fallbackValue
  } else if(defaultType === 'function'){
    return config.default()
  }
  return clone()(config.default)
}

export const getNodeData = (config: NodeConfig, path: Array<PathSegment>, getPropValue: (path:Array<PathSegment>) => any): any => {
  const renderer = nodeRendererStore.get(config.type)
  if (!renderer) throw new Error(`Couldn't find renderer for type '${config.type}'`)

  if (!renderer.newGetChildPaths || !renderer.newGetChildConfig || !renderer.mergeChildData) {
    return getPropValue(path)
  }
  const childPaths = renderer.newGetChildPaths(config, path, getPropValue)
  if (!childPaths.length) {
    return createDefault(config, renderer.createFallbackDefaultValue ? renderer.createFallbackDefaultValue(config) : null)
  }
  return renderer.mergeChildData(childPaths.map(childPath => {
    if (!renderer.newGetChildConfig) throw new Error()
    const childSegment = childPath[childPath.length - 1]
    if (!typeof childSegment === undefined) throw new Error()
    const childConfig = renderer.newGetChildConfig(config, childPath.slice(0, -1), childSegment, getPropValue)
    if (!childConfig) return {data: createDefault(config, renderer.createFallbackDefaultValue ? renderer.createFallbackDefaultValue(config) : null)}
    const childData = getNodeData(childConfig, childPath, getPropValue)
    return {config: childConfig, data: childData}
  }))
}

export const getNodePaths = (config: NodeConfig, path: Array<PathSegment>, getPropValue: (path:Array<PathSegment>) => any): Array<Array<PathSegment>> => {
  const renderer = nodeRendererStore.get(config.type)
  if(!renderer) throw new Error(`Couldn't find renderer for type '${config.type}'`)
if(!renderer.newGetChildPaths || !renderer.newGetChildConfig) return [path]
const childPaths = renderer.newGetChildPaths(config, path, getPropValue)
return childPaths.flatMap(childPath => {
  if(!renderer.newGetChildConfig) throw new Error()
  const childSegment = childPath[childPath.length - 1]
  const childConfig = renderer.newGetChildConfig(config, childPath.slice(0, -1), childSegment, getPropValue)
  if(!childConfig) return [ childPath ]
  return getNodePaths(childConfig, childPath, getPropValue)
})
}