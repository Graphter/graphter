import ListNodeRenderer from "./ListNodeRenderer";
import { NodeRendererRegistration } from "@graphter/core";
import { getChildData } from "./getChildData";
import { getChildPaths } from "./getChildPaths";

export interface ListNodeRendererOptions {
  type: string
}

export function registerListNodeRenderer(options?: ListNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'list',
    getChildData,
    getChildPaths,
    Renderer: ListNodeRenderer,
    options
  }
}