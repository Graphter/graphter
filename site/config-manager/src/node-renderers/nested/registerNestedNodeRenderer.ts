import NestedNodeRenderer from "./NestedNodeRenderer";
import { NodeRendererRegistration } from "@graphter/core";
import { getNestedChildData } from "./getNestedChildData";
import { getNestedChildPaths } from "./getNestedChildPaths";

export interface NestedNodeRendererOptions {
  type: string,
}

export function registerNestedNodeRenderer(options?: NestedNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'nested',
    name: 'Nested',
    description: 'Re-use another model nested within the data structure',
    getChildData: getNestedChildData,
    getChildPaths: getNestedChildPaths,
    Renderer: NestedNodeRenderer,
    options
  }
}