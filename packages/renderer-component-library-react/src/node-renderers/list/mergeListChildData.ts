import { MergeChildDataFn } from "@graphter/core";

export const mergeListChildData: MergeChildDataFn = async (config, path, internalNodeData, getExternalPathData, childData) => {
  return childData
    .filter((child, i) => {
      const itemMetadata = internalNodeData[i]
      if(!itemMetadata) return false
      return itemMetadata.committed && !itemMetadata.deleted
    })
    .map(child => child.data)
}