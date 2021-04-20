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
  optionsConfig?: NodeConfig

  newGetChildConfig?: NewGetChildConfigFn
  newGetChildPaths?: NewGetChildPathsFn
  mergeChildData?: MergeChildDataFn
  initialiser?: NodeDataInitialiserFn
  createFallbackDefaultValue?: CreateFallbackDefaultValueFn
}

/**
 * Definition of a function that returns all descendant paths in a tree (in no particular order)
 */
export interface NewGetChildPathsFn {
  (
    config: NodeConfig,
    path: Array<PathSegment>,
    getNodeValue: <T>(path: Array<PathSegment>) => T
  ): Promise<Array<Array<PathSegment>>>
}

export interface NewGetChildConfigFn {
  (
    config: NodeConfig,
    path: Array<PathSegment>,
    childSegment: PathSegment,
    getNodeValue: <T>(path: Array<PathSegment>) => T
  ): Promise<NodeConfig | null>
}

export interface MergeChildDataFn {
  (
    config: NodeConfig,
    path: Array<PathSegment>,
    getNodeValue: <T>(path: Array<PathSegment>) => T,
    childData: Array<{ config?: NodeConfig, data: any }>
  ): Promise<any>
}

export interface CreateFallbackDefaultValueFn {
  (
    config: NodeConfig,
    path: Array<PathSegment>,
    getNodeValue: <T>(path: Array<PathSegment>) => T
  ): Promise<any>
}

export interface NodeDataInitialiserFn {
  (
    originalTreeData: any,
    config: NodeConfig,
    path: Array<PathSegment>
  ): Promise<any>
}