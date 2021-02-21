import { MergeChildDataFn, NodeConfig } from "@graphter/core";

export const mergeObjectChildData:MergeChildDataFn = (config, path, getNodeValue, childData) => {
  return childData.reduce<{ [key: string]: any }>((a, c) => {
    if(!c.config) return a
    a[c.config.id] = c.data
    return a
  }, {})
}