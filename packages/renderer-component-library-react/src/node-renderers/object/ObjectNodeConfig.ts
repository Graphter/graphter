import { NodeConfig } from "@graphter/core";

export interface ObjectNodeConfig extends NodeConfig {
  children: Array<NodeConfig>
}