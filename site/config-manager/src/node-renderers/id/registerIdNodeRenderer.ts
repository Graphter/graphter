import IdNodeRenderer from "./IdNodeRenderer";
import { NodeRendererRegistration } from "@graphter/core";

export interface IdNodeRendererOptions {
  type: string
}

export function registerIdNodeRenderer(options?: IdNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'id',
    name: 'ID',
    description: 'Manage a human readable and web-friendly ID',
    createFallbackDefaultValue: () => Promise.resolve(''),
    Renderer: IdNodeRenderer,
    options
  }
}