import { NodeConfig, PathSegment } from "@graphter/core";
import { PathMeta } from "./PathMeta";

export interface DownstreamNodeConfigsHook {
  (path: Array<PathSegment>, config: NodeConfig): {
    configs: Array<NodeConfig>,
    downstreamConfigs: Array<NodeConfig>,
    setDownstreamConfig: (config: NodeConfig) => void,
    removeDownstreamConfig: () => void
  }
}