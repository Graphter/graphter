import { NodeConfig } from "@graphter/core";
import { ListNodeConfig } from "./ListNodeConfig";

export const isListConfig = (config: NodeConfig): config is ListNodeConfig => {
  if(!config.children?.length) return false
  return typeof config.options.itemSelectionBehaviour !== 'undefined' &&
    (typeof config.options.maxItems === 'undefined' || typeof config.options.maxItems === 'number')
}