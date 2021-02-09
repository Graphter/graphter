import ConditionalNodeRenderer from "./ConditionalNodeRenderer";
import { NodeRendererRegistration } from "@graphter/core";
import { getConditionalChildData } from "./getConditionalChildData";
import { getConditionalChildPaths } from "./getConditionalChildPaths";
import { initialiseConditionalData } from "./initialiseConditionalData";

export interface ConditionalNodeRendererOptions {
  type: string,
}

export function registerConditionalNodeRenderer(options?: ConditionalNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'conditional',
    name: 'Conditional',
    description: 'Conditional data structure depending on the value of another part of the tree',
    initialiseData: initialiseConditionalData,
    getChildData: getConditionalChildData,
    getChildPaths: getConditionalChildPaths,
    Renderer: ConditionalNodeRenderer,
    options
  }
}