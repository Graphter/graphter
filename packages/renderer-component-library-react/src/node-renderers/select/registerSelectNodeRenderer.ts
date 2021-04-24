import SelectNodeRenderer from "./SelectNodeRenderer";
import { NodeRendererRegistration } from "@graphter/core";

export interface SelectNodeRendererOptions {
  type: string
}

export function registerSelectNodeRenderer(options?: SelectNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'select',
    createFallbackDefaultValue: () => Promise.resolve(''),
    name: 'Select',
    description: 'Simple dropdown options',
    Renderer: SelectNodeRenderer,
    options
  }
}