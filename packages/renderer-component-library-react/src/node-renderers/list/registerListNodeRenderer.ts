import ListNodeRenderer from "./ListNodeRenderer";
import { NodeConfig, NodeRendererRegistration, PathSegment } from "@graphter/core";
import { getListChildData } from "./getListChildData";
import { getListChildPaths } from "./getListChildPaths";
import { initialiseListData } from "./initialiseListData";
import { getListChildConfig } from "./getListChildConfig";

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
    getChildConfig: getListChildConfig,
    getChildData: getListChildData,
    getChildPaths: getListChildPaths,
    Renderer: ListNodeRenderer,
    options
  }
}