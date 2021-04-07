import { NewGetChildConfigFn } from "@graphter/core";
import { isDynamicConfig } from "./isDynamicConfig";
import { getDynamicNodeDetails } from "./getDynamicNodeDetails";
import { serviceStore } from "@graphter/renderer-react";

export const createNewGetDynamicChildConfig = (configServiceId: string) => {
  const configService = serviceStore.get(configServiceId)
  const newGetDynamicChildConfig: NewGetChildConfigFn = async (config, path, childSegment, getNodeValue) => {
    if(!isDynamicConfig(config)) throw new Error('Invalid DynamicNodeRenderer config')
    const [
      dynamicConfig,
      dynamicRendererReg
    ] = await getDynamicNodeDetails(path, config, configService, getNodeValue)
    if(!dynamicConfig) return null
    return dynamicRendererReg?.newGetChildConfig ?
      dynamicRendererReg.newGetChildConfig(dynamicConfig, path, childSegment, getNodeValue) :
      null
  }
  return newGetDynamicChildConfig
}
