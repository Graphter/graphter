import { NodeConfig, PathSegment } from "@graphter/core";

export interface DataSelectNodeConfig extends NodeConfig {
  children: [ ]
  options: DataSelectNodeConfigOptions
}

export interface DataSelectNodeConfigOptions {
  serviceId: string
  keyPath: Array<PathSegment>
  valuePath: Array<PathSegment>
}