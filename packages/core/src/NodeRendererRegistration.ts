import { ComponentType } from "react";
import { NodeRendererProps } from "./NodeRendererProps";
import { PathSegment } from "./PathSegment";

export interface NodeRendererRegistration {
  type: string
  getChildData?: GetChildDataFn
  getChildPaths?: GetChildPathsFn
  Renderer: ComponentType<NodeRendererProps>
  options?: any
}

export interface GetChildDataFn {
  (
    path: Array<PathSegment>,
    getNodeValue: <T>(path: Array<PathSegment>) => Promise<T>
  ): Promise<any>
}

export interface GetChildPathsFn {
  (
    path: Array<PathSegment>,
    getNodeValue: <T>(path: Array<PathSegment>) => Promise<T>
  ): Promise<Array<Array<PathSegment>>>
}