import { NewGetChildPathsFn } from "@graphter/core";
import { isListConfig } from "./isListConfig";

export const newGetListChildPaths: NewGetChildPathsFn = async (config, path, getNodeValue) => {
  if(!isListConfig(config)) throw new Error('Invalid config')
  const arrayData = getNodeValue(path)
  if(!Array.isArray(arrayData)) return []
  return arrayData.map((itemData, i) => {
    return [...path, i]
  })
}