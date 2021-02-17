import { NodeConfig } from "@graphter/core";
import { ListNodeConfig } from "./ListNodeConfig";

export const isListConfig = (config: NodeConfig): config is ListNodeConfig => {
  if(!config.children?.length) return false
  return typeof config.children[0].options.itemSelectionBehaviour !== undefined
}