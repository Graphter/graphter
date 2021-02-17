import { MergeChildDataFn, NodeConfig } from "@graphter/core";

export const mergeObjectChildData:MergeChildDataFn = (childData: Array<{ config?: NodeConfig, data: any }>) => {
  return childData.reduce<{ [key: string]: any }>((a, c) => {
    if(!c.config) return a
    a[c.config.id] = c.data
    return a
  }, {})
}