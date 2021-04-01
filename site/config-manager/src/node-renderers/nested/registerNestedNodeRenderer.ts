import NestedNodeRenderer from "./NestedNodeRenderer";
import { NodeRendererRegistration } from "@graphter/core";
import { newGetNestedChildConfig } from "./newGetNestedChildConfig";
import { mergeNestedChildData } from "./mergeNestedChildData";
import { newGetNestedChildPaths } from "./newGetNestedChildPaths";
import { nestedInitialiser } from "./nestedInitialiser";

export interface NestedNodeRendererOptions {
  type: string,
}

export function registerNestedNodeRenderer(options?: NestedNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'nested',
    name: 'Nested',
    description: 'Re-use another model nested within the data structure',
    newGetChildConfig: newGetNestedChildConfig,
    newGetChildPaths: newGetNestedChildPaths,
    mergeChildData: mergeNestedChildData,
    initialiser: nestedInitialiser,
    Renderer: NestedNodeRenderer,
    options
  }
}