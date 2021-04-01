import { ComponentType } from "react";
import { NodeRendererProps } from "./NodeRendererProps";
import { PathSegment } from "./PathSegment";
import { NodeConfig } from "./NodeConfig";

export interface NodeRendererRegistration {
  type: string
  name: string
  description?: string
  Renderer: ComponentType<NodeRendererProps>
  options?: any

  newGetChildConfig?: NewGetChildConfigFn
  newGetChildPaths?: NewGetChildPathsFn
  mergeChildData?: MergeChildDataFn
  initialiser?: NodeDataInitialiserFn
  createFallbackDefaultValue?: CreateFallbackDefaultValueFn
}

export interface InitialiseNodeDataFn {
  (
    config: NodeConfig,
    path: Array<PathSegment>,
    initialise: (path: Array<PathSegment>, originalTreeData?: any) => void,
    originalTreeData?: any,
  ): any
}

export interface GetChildConfigFn {
  (
    config: NodeConfig,
    path: Array<PathSegment>,
    absolutePath: Array<PathSegment>,
    treeData: any
  ): Array<{ path: Array<PathSegment>, config: NodeConfig }>
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

export interface NewGetChildPathsFn {
  (
    config: NodeConfig,
    path: Array<PathSegment>,
    getNodeValue: <T>(path: Array<PathSegment>) => T
  ): Array<Array<PathSegment>>
}

export interface NewGetChildConfigFn {
  (
    config: NodeConfig,
    path: Array<PathSegment>,
    childSegment: PathSegment,
    getNodeValue: <T>(path: Array<PathSegment>) => T
  ): NodeConfig | null
}

export interface MergeChildDataFn {
  (
    config: NodeConfig,
    path: Array<PathSegment>,
    getNodeValue: <T>(path: Array<PathSegment>) => T,
    childData: Array<{ config?: NodeConfig, data: any }>
  ): any
}

export interface CreateFallbackDefaultValueFn {
  (
    config: NodeConfig,
    path: Array<PathSegment>,
    getNodeValue: <T>(path: Array<PathSegment>) => T
  ): any
}

export interface NodeDataInitialiserFn {
  (
    originalTreeData: any,
    config: NodeConfig,
    path: Array<PathSegment>
  ): any
}