import ObjectNodeRenderer from "./ObjectNodeRenderer";
import { NodeRendererRegistration } from "@graphter/core";
import { getObjectChildData } from "./getObjectChildData";
import { getObjectChildPaths } from "./getObjectChildPaths";
import { initialiseObjectData } from "./initialiseObjectData";
import { getObjectChildConfig } from "./getObjectChildConfig";

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
    getChildConfig: getObjectChildConfig,
    getChildData: getObjectChildData,
    getChildPaths: getObjectChildPaths,
    Renderer: ObjectNodeRenderer,
    options
  }
}