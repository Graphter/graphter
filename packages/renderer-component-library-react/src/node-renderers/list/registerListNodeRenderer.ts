import ListNodeRenderer from "./ListNodeRenderer";
import { NodeConfig, NodeRendererRegistration, PathSegment } from "@graphter/core";
import { initialiseListData } from "./initialiseListData";
import { newListGetChildConfig } from "./newListGetChildConfig";
import { mergeListChildData } from "./mergeListChildData";
import { newGetListChildPaths } from "./newGetListChildPaths";

export interface ListNodeRendererOptions {
  type?: string,
  customItemSelectionBehaviour?: (behaviour: string, config: NodeConfig, path: Array<PathSegment>) => void
}

export function registerListNodeRenderer(options?: ListNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'list',
    name: 'List',
    description: 'Manage lists of data',
    initialiseData: initialiseListData,
    newGetChildConfig: newListGetChildConfig,
    newGetChildPaths: newGetListChildPaths,
    mergeChildData: mergeListChildData,
    createFallbackDefaultValue: () => ([]),
    Renderer: ListNodeRenderer,
    options
  }
}