import { NodeConfig } from "@graphter/core";
import { DynamicNodeConfig } from "./DynamicNodeConfig";

export const isDynamicConfig = (config: NodeConfig): config is DynamicNodeConfig => {
  return typeof !config.children?.length &&
    Array.isArray(config.options?.siblingPath) &&
    config.options?.siblingPath.length > 0
}