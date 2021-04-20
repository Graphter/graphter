import { NodeConfig, PathQuerySegment } from "@graphter/core";

export interface DynamicDataPathSelectNodeConfig extends NodeConfig {
  children: [ ]
  options: DataPathSelectNodeConfigOptions
}

export interface DataPathSelectNodeConfigOptions {
  serviceIdPathQuery: Array<PathQuerySegment>
}