import { InitialiseNodeDataFn, PathSegment } from "@graphter/core";
import { getConfig, nodeRendererStore } from "@graphter/renderer-react";
import { pathUtils } from "@graphter/renderer-react";

export const initialiseNestedData:InitialiseNodeDataFn = (config, path, originalTreeData, initialise) => {
  if (config.children?.length) throw new Error(`${config.type} type '${config.id}' cannot have children but one or more was defined`)
  if(!config.options?.configId) throw new Error(`${config.type} type '${config.id}' must have a configId defined`)

  const nestedConfig = getConfig(config.options.configId)
  if(!nestedConfig) throw new Error(`${config.type} type '${config.id}' cannot cannot find the nested config '${config.options.configId}'`)
  const nestedRenderer = nodeRendererStore.get(nestedConfig.type)
  const transparentPath: Array<PathSegment> = [ ...path ]
  nestedRenderer.initialiseData(nestedConfig, transparentPath, originalTreeData, initialise)
}