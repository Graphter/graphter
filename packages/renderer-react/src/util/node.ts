import { NodeConfig, PathSegment } from "@graphter/core";
import clone from "rfdc";
import nodeRendererStore from "../store/nodeRendererStore";
import * as Path from "path";

export function createDefault(config: NodeConfig, fallbackValue: any = undefined): any {
  const defaultType = typeof config.default;
  if (defaultType === 'undefined') {
    if (typeof fallbackValue === 'undefined') {
      throw new Error(`A default value is required by the '${config.id}' model`)
    }
    return fallbackValue
  } else if (defaultType === 'function') {
    return config.default()
  }
  return clone()(config.default)
}

export const getTreeData = (config: NodeConfig, path: Array<PathSegment>, getPropValue: (path: Array<PathSegment>) => any): any => {
  const renderer = nodeRendererStore.get(config.type)
  if (!renderer.newGetChildPaths || !renderer.newGetChildConfig || !renderer.mergeChildData) {
    return getPropValue(path)
  }
  const childPaths = renderer.newGetChildPaths(config, path, getPropValue)
  if (!childPaths.length) {
    return createDefault(config, renderer.createFallbackDefaultValue ? renderer.createFallbackDefaultValue(config) : null)
  }
  return renderer.mergeChildData(config, path, getPropValue, childPaths.map(childPath => {
    if (!renderer.newGetChildConfig) throw new Error()
    const childSegment = childPath[childPath.length - 1]
    if (!typeof childSegment === undefined) throw new Error()
    const childConfig = renderer.newGetChildConfig(config, childPath.slice(0, -1), childSegment, getPropValue)
    if (!childConfig) return {data: createDefault(config, renderer.createFallbackDefaultValue ? renderer.createFallbackDefaultValue(config) : null)}
    const childData = getTreeData(childConfig, childPath, getPropValue)
    return {config: childConfig, data: childData}
  }))
}

export const getTreePaths = (config: NodeConfig, path: Array<PathSegment>, getPropValue: (path: Array<PathSegment>) => any): Array<Array<PathSegment>> => {
  const renderer = nodeRendererStore.get(config.type)
  if (!renderer.newGetChildPaths || !renderer.newGetChildConfig) return [ path ]
  const childPaths = renderer.newGetChildPaths(config, path, getPropValue)
  return childPaths.flatMap(childPath => {
    if (!renderer.newGetChildConfig) throw new Error()
    const childSegment = childPath[childPath.length - 1]
    const childConfig = renderer.newGetChildConfig(config, childPath.slice(0, -1), childSegment, getPropValue)
    if (!childConfig) return [ childPath ]
    return getTreePaths(childConfig, childPath, getPropValue)
  })
}

export const getConfigAt = (
  config: NodeConfig,
  localPath: Array<PathSegment>,
  getPropValue: (path: Array<PathSegment>) => any
): NodeConfig => {
  let currentConfig: NodeConfig = config
  let currentPath:Array<PathSegment> = []

  while(currentPath < localPath){

    const renderer = nodeRendererStore.get(currentConfig.type)
    if(!renderer.newGetChildConfig) return currentConfig

    const childSegment = localPath[currentPath.length]

    const nextConfig = renderer.newGetChildConfig(currentConfig, currentPath, childSegment, getPropValue)
    if(!nextConfig) return currentConfig
    currentPath.push(childSegment)
    currentConfig = nextConfig
  }

  return currentConfig
}

export const getConfigAtOld = (config: NodeConfig, localPath: Array<PathSegment>, getPropValue: (path: Array<PathSegment>) => any): NodeConfig | null => {
  const currentPath: Array<PathSegment> = []
  while (currentPath.length !== localPath.length){
    const renderer = nodeRendererStore.get(config.type)
    const childSegment = localPath[currentPath.length]
    if(!renderer.newGetChildConfig) return config
    const nextConfig = renderer.newGetChildConfig(config, localPath, childSegment, getPropValue)
    if(!nextConfig) return config
    config = nextConfig
    currentPath.push(localPath[currentPath.length])
  }
  return config
}