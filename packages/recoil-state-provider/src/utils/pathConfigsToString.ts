import { NodeConfig } from "@graphter/core";

export const pathConfigsToString = (
  pathConfigs: Array<Array<NodeConfig>>,
  segmentConfigsDelimiter = '/',
  pathConfigsDelimiter = '//'
) => pathConfigs
  .map(segmentConfigs => segmentConfigs
    .map(config => `${config.id}`)
    .join(segmentConfigsDelimiter))
  .join(pathConfigsDelimiter)