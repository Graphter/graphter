import { MergeChildDataFn } from "@graphter/core";
import { ItemMeta } from "./ListNodeRenderer";

export const mergeListChildData:MergeChildDataFn = (config, path, getNodeValue, childData) => {
  const listMetadata = getNodeValue<Array<ItemMeta>>(path)
  return childData
    .filter((child, i) => {
      const itemMetadata = listMetadata[i]
      if(!itemMetadata) return false
      return itemMetadata.committed && !itemMetadata.deleted
    })
    .map(child => child.data)
}