import { NodeConfig } from "@graphter/core";

/**
 * Takes a whole set of path configs and returns the path configs limited to a particular config
 * @param pathConfigs
 * @param config
 */
export const getExactPathConfigs = (pathConfigs: Array<Array<NodeConfig>>, config: NodeConfig): Array<Array<NodeConfig>> => {
  const lastPathSegmentConfigs = pathConfigs[pathConfigs.length - 1]
  const lastPathSegmentConfigIndex = lastPathSegmentConfigs
    .findIndex(config => config.id === config.id && config.type === config.type)
  if (lastPathSegmentConfigIndex === -1)
    throw new Error(`Couldn't find config '${config.id}' in the path configs '${
      pathConfigs
        .map(segmentConfigs => segmentConfigs
          .map(config => config.id)
          .join('/'))
        .join('//')
    }'`)
  return [ ...pathConfigs.slice(0, -1), [ ...lastPathSegmentConfigs.slice(0, lastPathSegmentConfigIndex + 1) ] ]
}