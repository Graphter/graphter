import { NodeConfig, PathSegment } from "@graphter/core";

export interface DynamicNodeConfig extends NodeConfig {
  children: [ NodeConfig, ...[NodeConfig] ],
  options: DynamicConfigConfigOptions
}

export interface DynamicConfigConfigOptions {
  siblingPath: Array<PathSegment>
  serviceId: string
}