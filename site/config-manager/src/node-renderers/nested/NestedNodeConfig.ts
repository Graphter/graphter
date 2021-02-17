import { NodeConfig } from "@graphter/core";

export interface NestedNodeConfig extends NodeConfig {
  options: NestedNodeConfigOptions
}

export interface NestedNodeConfigOptions {
  configId: string
}