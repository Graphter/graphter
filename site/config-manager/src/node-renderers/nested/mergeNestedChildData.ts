import { MergeChildDataFn } from "@graphter/core";

export const mergeNestedChildData:MergeChildDataFn = (childData) => {
  return childData[0].data
}