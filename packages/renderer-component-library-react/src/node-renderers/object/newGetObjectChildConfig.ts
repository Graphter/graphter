import { NewGetChildConfigFn } from "@graphter/core";
import { isObjectConfig } from "./isObjectConfig";

export const newGetObjectChildConfig: NewGetChildConfigFn = (config, path, childSegment, getNodeValue) => {
  if(!isObjectConfig(config)) throw new Error('Invalid config')
  return config.children.find(child => child.id === childSegment) || null
}