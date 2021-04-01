import StringNodeRenderer from "./StringNodeRenderer";
import { NodeRendererRegistration } from "@graphter/core";

export interface StringNodeRendererOptions {
  type: string
}

export function registerStringNodeRenderer(options?: StringNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'string',
    createFallbackDefaultValue: () => '',
    name: 'Text',
    description: 'Manage small amounts of plain text',
    Renderer: StringNodeRenderer,
    options
  }
}