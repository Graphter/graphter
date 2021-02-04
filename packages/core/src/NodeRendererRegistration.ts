import { ComponentType } from "react";
import { NodeRendererProps } from "./NodeRendererProps";
import { PathSegment } from "./PathSegment";
import { NodeConfig } from "./NodeConfig";

export interface NodeRendererRegistration {
  type: string
  name: string
  description?: string
  getChildData?: GetChildDataFn
  getChildPaths?: GetChildPathsFn
  Renderer: ComponentType<NodeRendererProps>
  options?: any
}

export interface GetChildDataFn {
  (
    config: NodeConfig,
    path: Array<PathSegment>,
    getNodeValue: <T>(path: Array<PathSegment>) => T
  ): any
}

export interface GetChildPathsFn {
  (
    config: NodeConfig,
    path: Array<PathSegment>,
    getNodeValue: <T>(path: Array<PathSegment>) => T
  ): Array<Array<PathSegment>>
}