import { NodeDataInitialiserFn } from "@graphter/core";
import { isDynamicConfig } from "./isDynamicConfig";
import { serviceStore } from "@graphter/renderer-react";
import { pathUtils } from "@graphter/renderer-react";
import { createDefault } from "@graphter/renderer-react";
import { getDynamicNodeDetails } from "./getDynamicNodeDetails";

export const createDynamicInitialiser = (configServiceId: string) => {
  const configService = serviceStore.get(configServiceId)
  const createDynamicInitialiser: NodeDataInitialiserFn = async (
    originalTreeData,
    config,
    path
  ) => {
    if(!isDynamicConfig(config)) throw new Error('Invalid DynamicNodeRenderer config')
    const [
      dynamicConfig,
      dynamicRendererReg
      ] = await getDynamicNodeDetails(path, config, configService, (path) => {
        return pathUtils.getValueByGlobalPath(originalTreeData, path, createDefault(config, null))
    })
    if(!dynamicConfig) return null
    return dynamicRendererReg?.initialiser ?
      dynamicRendererReg.initialiser(originalTreeData, dynamicConfig, path) :
      null
  }
  return createDynamicInitialiser
}
