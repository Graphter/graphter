import { NodeConfig, PathSegment } from "@graphter/core";

const pathConfigMap: Map<string, NodeConfig> = new Map()

const keySalt = '[50f4655b-e751-4e88-86e0-85b561b0fe12]'

const get = (path: Array<PathSegment>) => pathConfigMap.get(path.join(keySalt))
const set = (path: Array<PathSegment>, config: NodeConfig) =>
  pathConfigMap.set(path.join(keySalt), config)

export const pathConfigStore = {
  get,
  set
}

export default pathConfigStore