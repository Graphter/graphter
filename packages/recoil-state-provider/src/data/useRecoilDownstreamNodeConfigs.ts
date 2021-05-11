import { useRecoilState } from "recoil";
import { nodeConfigSetsStore } from "../store/nodeConfigSetsStore";
import { NodeConfig } from "@graphter/core";
import { getConfigSetKey } from "../utils/getConfigSetKey";
import { useRecoilTreeDataInitialiser } from "./useRecoilTreeDataInitialiser";
import { useRecoilTreeDataCallback } from "./useRecoilTreeDataCallback";
import { DownstreamNodeConfigsHook } from "@graphter/renderer-react";

const configToString = (config: NodeConfig) => `${config.id}[type=${config.type}]`

/**
 * @param path
 */
export const useRecoilDownstreamNodeConfigs: DownstreamNodeConfigsHook = (
  path,
  config
) => {
  const nodeConfigSetsState = nodeConfigSetsStore.get(path)
  if (!nodeConfigSetsState) throw new Error(`Missing configs state at '${path.join('/')}'`)

  const [ nodeConfigSets, setNodeConfigs ] = useRecoilState(nodeConfigSetsState)
  const configs = nodeConfigSets.configSets.get(nodeConfigSets.activeConfigsKey)
  if(!configs) throw new Error(`No active configs found at '${path.join('/')}'`)

  const treeDataInitialiser = useRecoilTreeDataInitialiser()
  const initialiseBranch = useRecoilTreeDataCallback<Array<NodeConfig>>(async (treeData, newConfig) => {
    const topNodeConfig = configs[0]
    const replacingTopConfig = topNodeConfig.id === newConfig.id && topNodeConfig.type === topNodeConfig.type
    treeDataInitialiser(replacingTopConfig ? newConfig : topNodeConfig, path, treeData)
  }, path.slice(0, 2))

  const currentConfigIndex = configs.findIndex(eachConfig => eachConfig.id === config.id && eachConfig)
  if(currentConfigIndex === -1) throw new Error(`Config ${configToString(config)} doesn't exist in set of configs ${configs.map(configToString).join(', ')}`)
  const downstreamConfigs = configs.slice(currentConfigIndex + 1)

  return {
    configs,
    downstreamConfigs,
    setDownstreamConfig: (newConfig: NodeConfig) => {
      initialiseBranch(newConfig)
      console.log('hello world')
    },
    removeDownstreamConfig: () => {

    }
  }
}