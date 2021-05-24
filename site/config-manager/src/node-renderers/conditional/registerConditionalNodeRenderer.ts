import ConditionalNodeRenderer from "./ConditionalNodeRenderer";
import { NodeRendererRegistration } from "@graphter/core";
import { conditionalInitialiser } from "./conditionalInitialiser";

export interface ConditionalNodeRendererOptions {
  type: string,
}

export function registerConditionalNodeRenderer(options?: ConditionalNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'conditional',
    name: 'Conditional',
    description: 'Conditional data structure depending on the value of another part of the tree',
    initialiser: conditionalInitialiser,
    Renderer: ConditionalNodeRenderer,
    options
  }
}