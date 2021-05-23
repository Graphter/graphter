import { useRecoilValue } from "recoil";
import { nodeConfigSetsStore } from "../store/nodeConfigSetsStore";
import { NodeConfig } from "@graphter/core";
import { useRecoilTreeDataInitialiser } from "./useRecoilTreeDataInitialiser";
import { useRecoilTreeDataCallback } from "./useRecoilTreeDataCallback";
import { DownstreamNodeConfigsHook } from "@graphter/renderer-react";
import { pathUtils } from "@graphter/renderer-react";

const configToString = (config: NodeConfig) => `${config.id}[type=${config.type}]`

/**
 * TODO: Rename useRecoilNodeChildConfigs or something...
 * @param path
 * @param config
 */
export const useRecoilDownstreamNodeConfigs: DownstreamNodeConfigsHook = (
  path,
  config
) => {
  const nodeConfigSetsState = nodeConfigSetsStore.get(path)
  if (!nodeConfigSetsState) throw new Error(`Missing configs state at '${path.join('/')}'`)

  const nodeConfigSets = useRecoilValue(nodeConfigSetsState)
  const configs = nodeConfigSets.configSets.get(nodeConfigSets.activeConfigsKey)
  if(!configs) throw new Error(`No active configs found at '${path.join('/')}'`)

  const treeDataInitialiser = useRecoilTreeDataInitialiser()
  const initialiseBranch = useRecoilTreeDataCallback<Array<NodeConfig>>(async (treeData, newConfig) => {
    const firstNodeConfig = configs[0]
    const replacingFirstConfig = firstNodeConfig.id === newConfig.id && firstNodeConfig.type === firstNodeConfig.type
    // Delete the section of the tree we're about to (re)initialise so that any new branches have default data
    const obscuredTreeData = pathUtils.deleteAtGlobalPath(treeData, path)
    treeDataInitialiser(replacingFirstConfig ? newConfig : firstNodeConfig, path, obscuredTreeData)
  }, path.slice(0, 2))

  const currentConfigIndex = configs.findIndex(eachConfig => eachConfig.id === config.id && eachConfig)
  if(currentConfigIndex === -1) throw new Error(`Config ${configToString(config)} doesn't exist in set of configs ${configs.map(configToString).join(', ')}`)
  const downstreamConfigs = configs.slice(currentConfigIndex + 1)

  return {
    configs,
    downstreamConfigs,
    setDownstreamConfig: (newConfig: NodeConfig) => {
      const downstreamConfig = downstreamConfigs[0]
      if(
        !downstreamConfig || (
          downstreamConfig.id !== newConfig.id &&
          downstreamConfig.type !== newConfig.type
        )
      ){
        initialiseBranch(newConfig)
      } else {
        console.log('No change to downstream config so skipping init')
      }
    },
    removeDownstreamConfig: () => {

    }
  }
}