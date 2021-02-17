import { NodeConfig } from "@graphter/core";

export interface ListNodeConfig extends NodeConfig {
  options: ListNodeConfigOptions
  children: [ NodeConfig ]
}

export interface ListNodeConfigOptions {
  itemSelectionBehaviour: 'CUSTOM' | 'INLINE'
}