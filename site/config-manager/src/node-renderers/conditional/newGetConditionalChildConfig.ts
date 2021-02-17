import { NewGetChildConfigFn } from "@graphter/core";
import { isConditionalConfig } from "./isConditionalConfig";
import { getMatchingConfig } from "./getMatchingConfig";

export const newGetConditionalChildConfig: NewGetChildConfigFn = (config, path, childSegment, getNodeValue) => {
  if(!isConditionalConfig(config)) throw new Error('Invalid config')
  const targetPath = [...path, ...config.options.siblingPath]
  const targetData = getNodeValue(targetPath)
  return getMatchingConfig(config, targetData)
}