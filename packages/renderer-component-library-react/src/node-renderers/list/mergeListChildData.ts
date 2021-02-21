import { MergeChildDataFn } from "@graphter/core";

export const mergeListChildData:MergeChildDataFn = (config, path, getNodeValue, childData) => {
  return childData.map(child => child.data)
}