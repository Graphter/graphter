import { GetChildPathsFn, PathSegment } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";
import { getConfig } from "@graphter/renderer-react";

export const getNestedChildPaths: GetChildPathsFn = (config, path, getNodeValue) => {
  if (config.children?.length) throw new Error(`${config.type} type '${config.id}' cannot have children but one or more was defined`)
  if(!config.options?.configId) throw new Error(`${config.type} type '${config.id}' must have a configId defined`)

  const nestedConfig = getConfig(config.options.configId)
  if(!nestedConfig) throw new Error(`${config.type} type '${config.id}' cannot cannot find the nested config '${config.options.configId}'`)
  const nestedRenderer = nodeRendererStore.get(nestedConfig.type)

  const childPath: Array<PathSegment> = [ ...path, config.options.configId ]

  console.info(`Transparently passing through nested node at at ${childPath.join('/')}`)
  return nestedRenderer.getChildPaths ?
    nestedRenderer.getChildPaths(nestedConfig, childPath, getNodeValue) :
    [ childPath ]
}