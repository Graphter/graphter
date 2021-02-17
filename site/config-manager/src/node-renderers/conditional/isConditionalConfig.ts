import { NodeConfig } from "@graphter/core";
import { ConditionalNodeConfig } from "./ConditionalNodeConfig";

export const isConditionalConfig = (config: NodeConfig): config is ConditionalNodeConfig => {
  return typeof !!config.children?.length &&
    Array.isArray(config.options?.siblingPath) &&
    config.options?.siblingPath.length > 0 &&
    Array.isArray(config.options?.branches) &&
    config.options?.branches.length > 0 &&
    !config.options?.branches.some((branch: any) => {
      // Return true if there's a problem
      const conditionType = typeof branch.condition
      return (conditionType !== 'string' && conditionType !== 'function') ||
        typeof branch.childId !== 'string'
    })
}