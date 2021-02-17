import { NewGetChildConfigFn } from "@graphter/core";
import { isListConfig } from "./isListConfig";

export const newListGetChildConfig: NewGetChildConfigFn = (config) => {
  if(!isListConfig(config)) throw new Error('Invalid config')
  return config.children[0]
}