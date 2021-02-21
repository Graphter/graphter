import ObjectNodeRenderer from "./ObjectNodeRenderer";
import { NodeRendererRegistration } from "@graphter/core";
import { initialiseObjectData } from "./initialiseObjectData";
import { newGetObjectChildConfig } from "./newGetObjectChildConfig";
import { mergeObjectChildData } from "./mergeObjectChildData";
import { newGetObjectChildPaths } from "./newGetObjectChildPaths";

export interface ObjectNodeRendererOptions {
  type: string
}

export function registerObjectNodeRenderer(options?: ObjectNodeRendererOptions): NodeRendererRegistration {
  const type = options?.type || 'object'
  return {
    type: type,
    name: 'Object',
    description: 'Manage complex nested structures',
    initialiseData: initialiseObjectData,
    newGetChildConfig: newGetObjectChildConfig,
    newGetChildPaths: newGetObjectChildPaths,
    createFallbackDefaultValue: () => ({}),
    mergeChildData: mergeObjectChildData,
    Renderer: ObjectNodeRenderer,
    options
  }
}