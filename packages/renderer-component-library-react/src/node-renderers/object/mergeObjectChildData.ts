import { MergeChildDataFn } from "@graphter/core";
import { isObjectConfig } from "./isObjectConfig";

export const mergeObjectChildData: MergeChildDataFn = (config, path, internalNodeData, getExternalPathData, childData) => {
  if(!isObjectConfig(config)) throw new Error('Invalid ObjectNodeRenderer config')
  return [ config.children.reduce<{ [key: string]: any }>((a, c, i) => {
    a[c.id] = childData[i]
    return a
  }, {}) ]
}