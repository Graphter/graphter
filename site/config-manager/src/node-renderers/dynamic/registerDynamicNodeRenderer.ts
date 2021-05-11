import { NodeRendererRegistration, Service } from "@graphter/core";
import createDynamicConfigNodeRenderer from "./createDynamicNodeRenderer";
import { createDynamicInitialiser } from "./createDynamicInitialiser";

export interface DataSelectNodeRendererOptions {
  type?: string,
  configServiceId: string
}

export function registerDynamicNodeRenderer(options: DataSelectNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'dynamic',
    name: 'Renderer options',
    description: 'Loads renderer options config on the fly depending on the value of a sibling property',
    createFallbackDefaultValue: () => Promise.resolve({}),
    initialiser: createDynamicInitialiser(options.configServiceId),
    Renderer: createDynamicConfigNodeRenderer(options.configServiceId),
    options
  }
}