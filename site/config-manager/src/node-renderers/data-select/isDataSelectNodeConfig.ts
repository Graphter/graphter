import { NodeConfig } from "@graphter/core";
import { DataSelectNodeConfig } from "./DataSelectNodeConfig";

export const isDataSelectNodeConfig = (config: NodeConfig): config is DataSelectNodeConfig => {
  return typeof !!config.children?.length &&
    config.options &&
    (
      config.options.serviceId && config.options.serviceId.length &&
      Array.isArray(config.options.keyPath) && config.options.keyPath.length &&
      Array.isArray(config.options.valuePath) && config.options.valuePath.length
    )
}