import NestedNodeRenderer from "./NestedNodeRenderer";
import { NodeRendererRegistration } from "@graphter/core";
import { getNestedChildData } from "./getNestedChildData";
import { getNestedChildPaths } from "./getNestedChildPaths";
import { initialiseNestedData } from "./initialiseNestedData";
import { getNestedChildConfig } from "./getNestedChildConfig";

export interface NestedNodeRendererOptions {
  type: string,
}

export function registerNestedNodeRenderer(options?: NestedNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'nested',
    name: 'Nested',
    description: 'Re-use another model nested within the data structure',
    initialiseData: initialiseNestedData,
    getChildConfig: getNestedChildConfig,
    getChildData: getNestedChildData,
    getChildPaths: getNestedChildPaths,
    Renderer: NestedNodeRenderer,
    options
  }
}