import { NodeConfig, PathSegment } from "@graphter/core";

const pathConfigMap: Map<string, NodeConfig> = new Map()

const keySalt = '[50f4655b-e751-4e88-86e0-85b561b0fe12]'

export const has = (path: Array<PathSegment>) => pathConfigMap.has(path.join(keySalt))
export const get = (path: Array<PathSegment>) => pathConfigMap.get(path.join(keySalt))
export const set = (path: Array<PathSegment>, config: NodeConfig) =>
  pathConfigMap.set(path.join(keySalt), config)

export default {
  has,
  get,
  set
}