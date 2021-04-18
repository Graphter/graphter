import { NodeConfig } from "@graphter/core";
import { DynamicDataPathSelectNodeConfig } from "./DynamicDataPathSelectNodeConfig";

export const isDynamicDataPathSelectNodeConfig = (config: NodeConfig): config is DynamicDataPathSelectNodeConfig => {
  return typeof !!config.children?.length &&
    config.options &&
    (
      Array.isArray(config.options.serviceIdPathQuery) && config.options.serviceIdPathQuery.length
    )
}