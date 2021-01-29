import { ComponentType } from "react";
import { NodeRendererProps } from "./NodeRendererProps";
import { PathSegment } from "./PathSegment";

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
    path: Array<PathSegment>,
    getNodeValue: <T>(path: Array<PathSegment>) => T
  ): any
}

export interface GetChildPathsFn {
  (
    path: Array<PathSegment>,
    getNodeValue: <T>(path: Array<PathSegment>) => T
  ): Array<Array<PathSegment>>
}