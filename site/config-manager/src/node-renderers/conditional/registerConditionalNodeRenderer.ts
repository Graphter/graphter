import ConditionalNodeRenderer from "./ConditionalNodeRenderer";
import { NodeRendererRegistration } from "@graphter/core";
import { getConditionalChildData } from "./getConditionalChildData";
import { getConditionalChildPaths } from "./getConditionalChildPaths";
import { initialiseConditionalData } from "./initialiseConditionalData";
import { getConditionalChildConfig } from "./getConditionalChildConfig";
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
    initialiseData: initialiseConditionalData,
    getChildConfig: getConditionalChildConfig,
    getChildData: getConditionalChildData,
    getChildPaths: getConditionalChildPaths,
    newGetChildConfig: newGetConditionalChildConfig,
    newGetChildPaths: newGetConditionalChildPaths,
    mergeChildData: mergeConditionalChildData,
    Renderer: ConditionalNodeRenderer,
    options
  }
}