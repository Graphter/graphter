import ObjectNodeRenderer from "./ObjectNodeRenderer";
import { NodeRendererRegistration } from "@graphter/core";
import { mergeObjectChildData } from "./mergeObjectChildData";
import { objectInitialiser } from "./objectInitialiser";

export interface ObjectNodeRendererOptions {
  type: string
}

export function registerObjectNodeRenderer(options?: ObjectNodeRendererOptions): NodeRendererRegistration {
  const type = options?.type || 'object'
  return {
    type: type,
    name: 'Object',
    description: 'Manage complex nested structures',
    createFallbackDefaultValue: () => Promise.resolve({}),
    initialiser: objectInitialiser,
    mergeChildData: mergeObjectChildData,
    Renderer: ObjectNodeRenderer,
    options
  }
}