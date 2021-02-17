import { NodeConfig } from "@graphter/core";
import { ObjectNodeConfig } from "./ObjectNodeConfig";

export const isObjectConfig = (config: NodeConfig): config is ObjectNodeConfig => {
  return !!config.children?.length
}