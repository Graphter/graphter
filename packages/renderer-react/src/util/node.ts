import { NodeConfig } from "@graphter/core";
import clone from "rfdc";

export function createDefault(config: NodeConfig, fallbackValue: any = undefined): any {
  const defaultType = typeof config.default;
  if (defaultType === 'undefined') {
    if (typeof fallbackValue === 'undefined') {
      throw new Error(`A default value is required by the '${config.id}' model`)
    }
    return fallbackValue
  } else if (defaultType === 'function') {
    return config.default()
  }
  return clone()(config.default)
}
