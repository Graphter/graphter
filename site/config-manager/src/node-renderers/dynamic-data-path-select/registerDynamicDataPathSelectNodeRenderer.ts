import { DynamicDataPathSelectNodeConfig } from "./DynamicDataPathSelectNodeConfig";
import DynamicDataPathSelectNodeRenderer from "./DynamicDataPathSelectNodeRenderer";

export function registerDynamicDataPathSelectNodeRenderer(options?:DynamicDataPathSelectNodeConfig){
  return {
    type: options?.type || 'dynamic-data-path-select',
    name: 'Data Path Select',
    description: 'Select a path from a loaded data source',
    createFallbackDefaultValue: () => Promise.resolve(null),
    Renderer: DynamicDataPathSelectNodeRenderer,
    options,
  }
}