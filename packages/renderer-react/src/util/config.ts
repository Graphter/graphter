import { NodeConfig, PathSegment } from "@graphter/core";


const getAt = (config: NodeConfig | undefined, path?: Array<PathSegment> | null) => {
  const targetConfig = path?.reduce((config: NodeConfig | undefined, pathSegment: PathSegment) => {
    return config?.children?.find(childConfig => childConfig.id === pathSegment)
  }, config)
  if(typeof targetConfig === 'undefined'){
    throw new Error(`Could not find config at ${path?.join('/')} within: ${JSON.stringify(config)}.`)
  }
  return targetConfig
}

export const configUtils = {
  getAt
}