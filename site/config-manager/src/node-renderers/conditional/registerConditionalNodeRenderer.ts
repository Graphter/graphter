import ConditionalNodeRenderer from "./ConditionalNodeRenderer";
import { NodeRendererRegistration } from "@graphter/core";
import { newGetConditionalChildConfig } from "./newGetConditionalChildConfig";
import { mergeConditionalChildData } from "./mergeConditionalChildData";
import { newGetConditionalChildPaths } from "./newGetConditionalChildPaths";

export interface ConditionalNodeRendererOptions {
  type: string,
}

export function registerConditionalNodeRenderer(options?: ConditionalNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'conditional',
    name: 'Conditional',
    description: 'Conditional data structure depending on the value of another part of the tree',
    newGetChildConfig: newGetConditionalChildConfig,
    newGetChildPaths: newGetConditionalChildPaths,
    mergeChildData: mergeConditionalChildData,
    createFallbackDefaultValue: () => ([]),
    Renderer: ConditionalNodeRenderer,
    options
  }
}