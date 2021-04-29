import { NodeConfig, NodeRendererRegistration, PathSegment } from "@graphter/core";

export interface PathMeta {
  path: Array<PathSegment>,
  nodes: Array<PathMetaNode>,
  childPaths: Array<Array<PathSegment>>
}

export interface PathMetaNode {
  internalData?: any,
  config: NodeConfig,
  rendererRegistration: NodeRendererRegistration
}