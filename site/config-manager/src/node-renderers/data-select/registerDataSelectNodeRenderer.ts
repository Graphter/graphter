import DataSelectNodeRenderer from "./DataSelectNodeRenderer";
import { NodeRendererRegistration } from "@graphter/core";

export interface DataSelectNodeRendererOptions {
  type: string
}

export function registerDataSelectNodeRenderer(options?: DataSelectNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'data-select',
    name: 'Data Select',
    description: 'Manage a selection from a set of options supplied by a data source',
    Renderer: DataSelectNodeRenderer,
    options
  }
}