import ListNodeRenderer from "./ListNodeRenderer";
import {
  NodeConfig,
  NodeRendererRegistration,
  PathSegment
} from "@graphter/core";
import { newListGetChildConfig } from "./newListGetChildConfig";
import { mergeListChildData } from "./mergeListChildData";
import { newGetListChildPaths } from "./newGetListChildPaths";
import { listInitialiser } from "./listInitialiser";

export interface ListNodeRendererOptions {
  type?: string,
  customItemSelectionBehaviour?: (behaviour: string, config: NodeConfig, path: Array<PathSegment>) => void
}

export function registerListNodeRenderer(options?: ListNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'list',
    name: 'List',
    description: 'Manage lists of data',
    newGetChildConfig: newListGetChildConfig,
    newGetChildPaths: newGetListChildPaths,
    mergeChildData: mergeListChildData,
    createFallbackDefaultValue: () => Promise.resolve([]),
    initialiser: listInitialiser,
    Renderer: ListNodeRenderer,
    options
  }
}