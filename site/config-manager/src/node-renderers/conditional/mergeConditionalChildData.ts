import { MergeChildDataFn } from "@graphter/core";

export const mergeConditionalChildData:MergeChildDataFn = (childData) => {
  return childData[0].data
}