import { NewGetChildConfigFn } from "@graphter/core";
import { isNestedConfig } from "./isNestedConfig";
import { getConfig } from "@graphter/renderer-react";

export const newGetNestedChildConfig: NewGetChildConfigFn = (config) => {
  if(!isNestedConfig(config)) throw new Error('Invalid config')
  const nestedConfig = getConfig(config.options.configId)
  if(!nestedConfig) throw new Error(`${config.type} type '${config.id}' cannot cannot find the nested config '${config.options.configId}'`)
  return nestedConfig
}