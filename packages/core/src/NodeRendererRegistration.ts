import { ComponentType } from "react";
import { NodeRendererProps } from "./NodeRendererProps";
import { PathSegment } from "./PathSegment";
import { NodeConfig } from "./NodeConfig";

export interface NodeRendererRegistration {
  type: string
  name: string
  description?: string
  initialiseData: InitialiseNodeDataFn
  getChildConfig?: GetChildConfigFn
  getChildData?: GetChildDataFn
  getChildPaths?: GetChildPathsFn
  Renderer: ComponentType<NodeRendererProps>
  options?: any
}

export interface InitialiseNodeDataFn {
  (
    config: NodeConfig,
    path: Array<PathSegment>,
    originalTreeData: any,
    initialise: (path: Array<PathSegment>, originalTreeData: any) => void
  ): any
}

export interface GetChildConfigFn {
  (
    configs: Array<NodeConfig>,
    absolutePath: Array<PathSegment>,
    relativePath: Array<PathSegment>,
    treeData: any
  ): Array<NodeConfig>
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