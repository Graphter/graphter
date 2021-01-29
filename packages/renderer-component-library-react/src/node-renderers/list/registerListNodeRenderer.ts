import ListNodeRenderer from "./ListNodeRenderer";
import { NodeRendererRegistration } from "@graphter/core";
import { getListChildData } from "./getListChildData";
import { getListChildPaths } from "./getListChildPaths";

export interface ListNodeRendererOptions {
  type: string
}

export function registerListNodeRenderer(options?: ListNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'list',
    name: 'List',
    description: 'Manage lists of data',
    getChildData: getListChildData,
    getChildPaths: getListChildPaths,
    Renderer: ListNodeRenderer,
    options
  }
}