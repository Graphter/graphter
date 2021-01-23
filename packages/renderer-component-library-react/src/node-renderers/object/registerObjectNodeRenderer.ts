import ObjectNodeRenderer from "./ObjectNodeRenderer";
import { NodeRendererRegistration } from "@graphter/core";
import { getChildData } from "./getChildData";
import { getChildPaths } from "./getChildPaths";

export interface ObjectNodeRendererOptions {
  type: string
}

export function registerObjectNodeRenderer(options?: ObjectNodeRendererOptions): NodeRendererRegistration {
  const type = options?.type || 'object'
  return {
    type: type,
    name: 'Object',
    description: 'Manage complex nested structures',
    getChildData,
    getChildPaths,
    Renderer: ObjectNodeRenderer,
    options
  }
}