import { MergeChildDataFn } from "@graphter/core";
import { isDynamicConfig } from "./isDynamicConfig";
import { getDynamicNodeDetails } from "./getDynamicNodeDetails";
import { serviceStore } from "@graphter/renderer-react";

export const createMergeDynamicChildData = (configServiceId: string) => {
  const configService = serviceStore.get(configServiceId)
  const mergeDynamicChildData:MergeChildDataFn = async (config, path, getNodeValue, childData) => {
    if(!isDynamicConfig(config)) throw new Error('Invalid DynamicNodeRenderer config')
    const [
      dynamicConfig,
      dynamicRendererReg
    ] = await getDynamicNodeDetails(path, config, configService, getNodeValue)
    if(!dynamicConfig) return null
    return dynamicRendererReg?.mergeChildData ?
      dynamicRendererReg.mergeChildData(dynamicConfig, path, getNodeValue, childData) :
      null
  }
  return mergeDynamicChildData
}
