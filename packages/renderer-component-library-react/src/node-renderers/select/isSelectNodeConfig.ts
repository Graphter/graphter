import { NodeConfig } from "@graphter/core";
import { SelectNodeConfig } from "./SelectNodeConfig";

export const isSelectNodeConfig = (config: NodeConfig): config is SelectNodeConfig => {
  return config.children?.length !== 0 && (
    config.options?.options &&
    Object.keys(config.options?.options).length !== 0
  )
}