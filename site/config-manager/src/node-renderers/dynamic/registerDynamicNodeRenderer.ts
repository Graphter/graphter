import { NodeRendererRegistration, Service } from "@graphter/core";
import createDynamicConfigNodeRenderer from "./createDynamicNodeRenderer";

export interface DataSelectNodeRendererOptions {
  type?: string,
  configServiceId: string
}

export function registerDynamicNodeRenderer(options: DataSelectNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'renderer-options',
    name: 'Renderer options',
    description: 'Loads renderer options config on the fly depending on the value of a sibling property',
    createFallbackDefaultValue: () => ({}),
    Renderer: createDynamicConfigNodeRenderer(options.configServiceId),
    options
  }
}