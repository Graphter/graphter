import ListNodeRenderer from "./ListNodeRenderer";
import { NodeRendererRegistration } from "@graphter/core";
import { getListChildData } from "./getListChildData";
import { getListChildPaths } from "./getListChildPaths";
import { initialiseListData } from "./initialiseListData";

export interface ListNodeRendererOptions {
  type: string
}

export function registerListNodeRenderer(options?: ListNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'list',
    name: 'List',
    description: 'Manage lists of data',
    initialiseData: initialiseListData,
    getChildData: getListChildData,
    getChildPaths: getListChildPaths,
    Renderer: ListNodeRenderer,
    options
  }
}