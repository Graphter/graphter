import { NodeConfig, PathSegment } from "@graphter/core";

export interface DataSelectNodeConfig extends NodeConfig {
  children: [ NodeConfig, ...[NodeConfig] ]
  serviceId: string
  keyPath: Array<PathSegment>
  valuePath: Array<PathSegment>
}