import { NodeConfig } from "@graphter/core";

export interface SelectNodeConfig extends NodeConfig {
  children: [],
  options: SelectNodeConfig
}

export interface SelectNodeConfigOptions {
  placeholder: string
  options: { [key: string]: string}
}