import IdNodeRenderer from "./IdNodeRenderer";
import { NodeRendererRegistration } from "@graphter/core";
import { createValueInitialiser } from "@graphter/renderer-react";

export interface IdNodeRendererOptions {
  type: string
}

export function registerIdNodeRenderer(options?: IdNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'id',
    name: 'ID',
    description: 'Manage a human readable and web-friendly ID',
    initialiseData: createValueInitialiser(''),
    Renderer: IdNodeRenderer,
    options
  }
}