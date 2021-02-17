import { NodeConfig, PathSegment } from "@graphter/core";

export interface ConditionalNodeConfig extends NodeConfig {
  children: [ NodeConfig, ...[NodeConfig] ],
  options: ConditionalNodeConfigOptions
}

export interface ConditionalNodeConfigOptions {
  siblingPath: Array<PathSegment>,
  branches: Array<ConditionalNodeBranch>,
  noMatchValue: any
}

export interface ConditionalNodeBranch {
  condition: string | ((targetData: any) => true),
  childId: string
}