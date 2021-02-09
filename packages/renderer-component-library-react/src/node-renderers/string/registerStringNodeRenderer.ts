import StringNodeRenderer from "./StringNodeRenderer";
import { NodeRendererRegistration } from "@graphter/core";
import { createValueInitialiser } from "@graphter/renderer-react";

export interface StringNodeRendererOptions {
  type: string
}

export function registerStringNodeRenderer(options?: StringNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'string',
    initialiseData: createValueInitialiser(''),
    name: 'Text',
    description: 'Manage small amounts of plain text',
    Renderer: StringNodeRenderer,
    options
  }
}