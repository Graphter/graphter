import { NodeConfig } from "@graphter/core";

export const getConfigSetKey = (configs: Array<NodeConfig>) => `config-set-${configs.map(config => config.id).join('[5b983d8b-8039-4d64-ae25-f9b85c92f926]')}`