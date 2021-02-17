import { MergeChildDataFn } from "@graphter/core";

export const mergeListChildData:MergeChildDataFn = (childData) => {
  return childData.map(child => child.data)
}