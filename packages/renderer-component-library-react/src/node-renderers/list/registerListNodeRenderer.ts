import ListNodeRenderer from "./ListNodeRenderer";
import {
  NodeConfig,
  NodeRendererRegistration,
  PathSegment
} from "@graphter/core";
import { mergeListChildData } from "./mergeListChildData";
import { listInitialiser } from "./listInitialiser";
import { listOptionsConfig } from "./listOptionsConfig";

export interface ListNodeRendererOptions {
  type?: string,
  customItemSelectionBehaviour?: (behaviour: string, config: NodeConfig, path: Array<PathSegment>) => void
}

export function registerListNodeRenderer(options?: ListNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'list',
    name: 'List',
    description: 'Manage lists of data',
    mergeChildData: mergeListChildData,
    createFallbackDefaultValue: () => Promise.resolve([]),
    initialiser: listInitialiser,
    Renderer: ListNodeRenderer,
    options,
    optionsConfig: listOptionsConfig
  }
}