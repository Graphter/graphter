import { MergeChildDataFn } from "@graphter/core";
import { isDynamicConfig } from "./isDynamicConfig";
import { getDynamicNodeDetails } from "./getDynamicNodeDetails";
import { serviceStore } from "@graphter/renderer-react";

export const createMergeDynamicChildData = (configServiceId: string) => {
  const configService = serviceStore.get(configServiceId)
  const mergeDynamicChildData: MergeChildDataFn = (config, path, internalNodeData, getExternalPathData, childData) => {
    return childData
  }
  return mergeDynamicChildData
}
