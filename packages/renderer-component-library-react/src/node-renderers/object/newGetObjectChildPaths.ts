import { NewGetChildPathsFn } from "@graphter/core";
import { isObjectConfig } from "./isObjectConfig";

export const newGetObjectChildPaths: NewGetChildPathsFn = (config, path) => {
  if(!isObjectConfig(config)) throw new Error('Invalid config')
  return config.children.map(childConfig => {
    return [ ...path, childConfig.id ]
  })
}