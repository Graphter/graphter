import { NodeConfig, PathSegment } from "@graphter/core";
import clone from "rfdc";
import nodeRendererStore from "../store/nodeRendererStore";

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

export const getTreeData = async (config: NodeConfig, path: Array<PathSegment>, getPropValue: (path: Array<PathSegment>) => any, depth?: number): Promise<any> => {
  if(depth !== undefined && depth === 0) return null
  const renderer = nodeRendererStore.get(config.type)
  if (!renderer.newGetChildPaths || !renderer.newGetChildConfig || !renderer.mergeChildData) {
    return getPropValue(path)
  }
  const childPaths = await renderer.newGetChildPaths(config, path, getPropValue)
  if (!childPaths.length) {
    return createDefault(config, renderer.createFallbackDefaultValue ? renderer.createFallbackDefaultValue(config, path, getPropValue) : null)
  }
  const childData = await Promise.all(childPaths.map(async (childPath) => {
    if (!renderer.newGetChildConfig) throw new Error()
    const childSegment = childPath[childPath.length - 1]
    if (!typeof childSegment === undefined) throw new Error()
    const childConfig = await renderer.newGetChildConfig(config, childPath.slice(0, -1), childSegment, getPropValue)
    if (!childConfig) return {
      config,
      data: createDefault(config, renderer.createFallbackDefaultValue ? renderer.createFallbackDefaultValue(config, path, getPropValue) : null)
    }
    const childData = await getTreeData(childConfig, childPath, getPropValue, depth === undefined ? undefined : depth - 1)
    return {config: childConfig, data: childData}
  }))
  return renderer.mergeChildData(config, path, getPropValue, childData)
}

export const getTreeMeta = async (
  config: NodeConfig,
  path: Array<PathSegment>,
  getPropValue: (path: Array<PathSegment>) => any
): Promise<Array<{ config: NodeConfig, path: Array<PathSegment> }>> => {
  const result = {
    config,
    path
  }
  const renderer = nodeRendererStore.get(config.type)
  if (!renderer.newGetChildPaths || !renderer.newGetChildConfig || !renderer.mergeChildData) {
    return [ result ]
  }
  const childPaths = await renderer.newGetChildPaths(config, path, getPropValue)
  if (!childPaths.length) {
    return [ result ]
  }

  const childResults = await Promise.all(childPaths.map(async (childPath) => {
    if (!renderer.newGetChildConfig) throw new Error()
    const childSegment = childPath[childPath.length - 1]
    if (!typeof childSegment === undefined) throw new Error()
    const childConfig = await renderer.newGetChildConfig(config, childPath.slice(0, -1), childSegment, getPropValue)
    if (!childConfig) throw new Error(`Couldn't find config for path ${childPath.join('/')}`)
    return getTreeMeta(childConfig, childPath, getPropValue)
  }))

  return [
    result,
    ...childResults.flat()
  ]
}

export const getTreePaths = async (
  config: NodeConfig,
  path: Array<PathSegment>,
  getPropValue: (path: Array<PathSegment>) => any
): Promise<Array<Array<PathSegment>>> => {
  const treeMeta = await getTreeMeta(config, path, getPropValue)
  return treeMeta.map(nodeMeta => nodeMeta.path)
}

export const getConfigAt = async (
  startingConfig: NodeConfig,
  targetPath: Array<PathSegment>,
  getPropValue: (path: Array<PathSegment>) => any
): Promise<NodeConfig | null> => {
  const configs = await getConfigsTo(startingConfig, targetPath, getPropValue)
  return configs?.length ? configs[configs.length - 1] : null
}

export const getConfigsTo = async (
  startingConfig: NodeConfig,
  targetPath: Array<PathSegment>,
  getPropValue: (path: Array<PathSegment>) => any
): Promise<Array<NodeConfig> | null> => {
  let currentConfig: NodeConfig = startingConfig
  let currentPath: Array<PathSegment> = targetPath.slice(0, 2)
  let configs: Array<NodeConfig> = [ startingConfig ]
  while (currentPath < targetPath) {

    const renderer = nodeRendererStore.get(currentConfig.type)
    if (!renderer.newGetChildConfig) break

    const childSegment = targetPath[currentPath.length]

    const nextConfig = await renderer.newGetChildConfig(currentConfig, currentPath, childSegment, getPropValue)
    if (!nextConfig) break
    currentPath.push(childSegment)
    configs.push(nextConfig)
    currentConfig = nextConfig
  }

  return configs
}
