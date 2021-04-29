import { MergeChildDataFn } from "@graphter/core";
import { isDynamicConfig } from "./isDynamicConfig";
import { getDynamicNodeDetails } from "./getDynamicNodeDetails";
import { serviceStore } from "@graphter/renderer-react";

export const createMergeDynamicChildData = (configServiceId: string) => {
  const configService = serviceStore.get(configServiceId)
  const mergeDynamicChildData: MergeChildDataFn = async (config, path, internalNodeData, getExternalPathData, childData) => {
    if(!isDynamicConfig(config)) throw new Error('Invalid DynamicNodeRenderer config')
    const [
      dynamicConfig,
      dynamicRendererReg
    ] = await getDynamicNodeDetails(path, config, configService, internalNodeData)
    if(!dynamicConfig) return []
    return dynamicRendererReg?.mergeChildData ?
      dynamicRendererReg.mergeChildData(dynamicConfig, path, internalNodeData, getExternalPathData, childData) :
      []
  }
  return mergeDynamicChildData
}
