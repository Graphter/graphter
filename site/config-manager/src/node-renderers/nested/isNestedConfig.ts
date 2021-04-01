import { NodeConfig } from "@graphter/core";
import { NestedNodeConfig } from "./NestedNodeConfig";

export const isNestedConfig = (config: NodeConfig): config is NestedNodeConfig => {
  return typeof config.children === 'undefined' &&
    typeof config.options?.configId === 'string'
}