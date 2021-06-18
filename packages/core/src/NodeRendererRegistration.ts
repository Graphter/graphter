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
  mergeChildData?: MergeChildDataFn
  initialiser?: NodeDataInitialiserFn
  createFallbackDefaultValue?: CreateFallbackDefaultValueFn
}

export interface MergeChildDataFn {
  (
    config: NodeConfig,
    path: Array<PathSegment>,
    internalNodeData: any,
    getExternalPathData: (path: Array<PathSegment>) => any,
    childData: Array<{ config?: NodeConfig, data: any }>
  ): any
}

export interface CreateFallbackDefaultValueFn {
  (
    config: NodeConfig,
    path: Array<PathSegment>,
    getBranchData: <T>(path: Array<PathSegment>) => Promise<T | undefined>
  ): Promise<any>
}

export interface NodeDataInitialiserFn {
  (
    getInternalData: <T>(path: Array<PathSegment>) => Promise<T | undefined>,
    config: NodeConfig,
    path: Array<PathSegment>
  ): Promise<Array<NodeInitialisationData>>
}

export interface NodeInitialisationData {
  path: Array<PathSegment>
  config: NodeConfig
  internalData?: any
}