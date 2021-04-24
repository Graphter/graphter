import NumberNodeRenderer from "./NumberNodeRenderer";
import { NodeRendererRegistration } from "@graphter/core";

export interface NumberNodeRendererOptions {
  type: string
}

export function registerNumberNodeRenderer(options?: NumberNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'number',
    createFallbackDefaultValue: () => Promise.resolve(''),
    name: 'Number',
    description: 'Manage numbers',
    Renderer: NumberNodeRenderer,
    options
  }
}