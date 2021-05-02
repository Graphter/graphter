import { MergeChildDataFn } from "@graphter/core";
import { isNestedConfig } from "./isNestedConfig";
import { getConfig, nodeRendererStore } from "@graphter/renderer-react";

export const mergeNestedChildData:MergeChildDataFn = (config, path, internalNodeData, getExternalPathData, childData) => {
  return childData
}