import NestedNodeRenderer from "./NestedNodeRenderer";
import { NodeRendererRegistration } from "@graphter/core";
import { initialiseNestedData } from "./initialiseNestedData";
import { newGetNestedChildConfig } from "./newGetNestedChildConfig";
import { mergeNestedChildData } from "./mergeNestedChildData";
import { newGetNestedChildPaths } from "./newGetNestedChildPaths";

export interface NestedNodeRendererOptions {
  type: string,
}

export function registerNestedNodeRenderer(options?: NestedNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'nested',
    name: 'Nested',
    description: 'Re-use another model nested within the data structure',
    initialiseData: initialiseNestedData,
    newGetChildConfig: newGetNestedChildConfig,
    newGetChildPaths: newGetNestedChildPaths,
    mergeChildData: mergeNestedChildData,
    Renderer: NestedNodeRenderer,
    options
  }
}