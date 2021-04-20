import { NewGetChildPathsFn } from "@graphter/core";
import { isDynamicConfig } from "./isDynamicConfig";
import { getDynamicNodeDetails } from "./getDynamicNodeDetails";
import { serviceStore } from "@graphter/renderer-react";

export const createNewGetDynamicChildPaths = (configServiceId: string) => {
  const configService = serviceStore.get(configServiceId)
  const newGetDynamicChildPaths: NewGetChildPathsFn = async (config, path, getNodeValue) => {
    if(!isDynamicConfig(config)) throw new Error('Invalid Dynamic config')
    const [
      dynamicConfig,
      dynamicRendererReg
    ] = await getDynamicNodeDetails(path, config, configService, getNodeValue)
    if(!dynamicConfig) return []
    return dynamicRendererReg?.newGetChildPaths ?
      dynamicRendererReg.newGetChildPaths(dynamicConfig, path, getNodeValue) :
      []
  }
  return newGetDynamicChildPaths
}