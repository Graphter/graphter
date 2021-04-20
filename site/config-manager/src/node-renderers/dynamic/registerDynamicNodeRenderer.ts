import { NodeRendererRegistration, Service } from "@graphter/core";
import createDynamicConfigNodeRenderer from "./createDynamicNodeRenderer";
import { createDynamicInitialiser } from "./createDynamicInitialiser";
import { createNewGetDynamicChildConfig } from "./createNewGetDynamicChildConfig";
import { createNewGetDynamicChildPaths } from "./createNewGetDynamicChildPaths";
import { createMergeDynamicChildData } from "./createMergeDynamicChildData";

export interface DataSelectNodeRendererOptions {
  type?: string,
  configServiceId: string
}

export function registerDynamicNodeRenderer(options: DataSelectNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'dynamic',
    name: 'Renderer options',
    description: 'Loads renderer options config on the fly depending on the value of a sibling property',
    createFallbackDefaultValue: () => Promise.resolve({}),
    initialiser: createDynamicInitialiser(options.configServiceId),
    newGetChildConfig: createNewGetDynamicChildConfig(options.configServiceId),
    newGetChildPaths: createNewGetDynamicChildPaths(options.configServiceId),
    mergeChildData: createMergeDynamicChildData(options.configServiceId),
    Renderer: createDynamicConfigNodeRenderer(options.configServiceId),
    options
  }
}