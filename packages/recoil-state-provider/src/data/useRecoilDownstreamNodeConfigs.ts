import { useRecoilValue } from "recoil";
import { nodeConfigSetsStore } from "../store/nodeConfigSetsStore";
import { NodeConfig, PathSegment } from "@graphter/core";
import { useRecoilTreeDataInitialiser } from "./useRecoilTreeDataInitialiser";
import { useRecoilTreeDataCallback } from "./useRecoilTreeDataCallback";
import { DownstreamNodeConfigsHook } from "@graphter/renderer-react";
import { pathUtils } from "@graphter/renderer-react";
import { createPromiseQueue } from "../utils/createPromiseQueue";

const configToString = (config: NodeConfig) => `${config.id}[type=${config.type}]`

let branchInitQueue = createPromiseQueue<void>()

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
  if (!configs) throw new Error(`No active configs found at '${path.join('/')}'`)

  const treeDataInitialiser = useRecoilTreeDataInitialiser()
  const initialiseBranch = useRecoilTreeDataCallback<[
    NodeConfig,
    Array<NodeConfig>,
    (config: NodeConfig, path: Array<PathSegment>, obscuredTreeData: any) => Promise<void>,
    Array<PathSegment>
  ]>(branchInitFn, path.slice(0, 2))

  const currentConfigIndex = configs.findIndex(eachConfig => eachConfig.id === config.id && eachConfig)
  if (currentConfigIndex === -1) throw new Error(`Config ${configToString(config)} doesn't exist in set of configs ${configs.map(configToString).join(', ')}`)
  const downstreamConfigs = configs.slice(currentConfigIndex + 1)

  console.log({ config: downstreamConfigs[0] })

  return {
    configs,
    downstreamConfigs: [ ...downstreamConfigs ],
    setDownstreamConfig: (newConfig: NodeConfig) => {
      const downstreamConfig = downstreamConfigs[0]
      if (
        !downstreamConfig ||
        downstreamConfig.id !== newConfig.id ||
        downstreamConfig.type !== newConfig.type
      ) {
        branchInitQueue.enqueue(initialiseBranch.bind(null, newConfig, configs, treeDataInitialiser, path))
      } else {
        console.log('No change to downstream config so skipping init')
      }
    },
    removeDownstreamConfig: () => {
      branchInitQueue.enqueue(initialiseBranch.bind(null, configs[currentConfigIndex], configs, treeDataInitialiser, path))
    }
  }
}

const branchInitFn = async (
  treeData: any,
  newConfig: NodeConfig,
  configs: Array<NodeConfig>,
  treeDataInitialiser:(config: NodeConfig, path: Array<PathSegment>, obscuredTreeData: any) => Promise<void>,
  path: Array<PathSegment>
): Promise<void> => {
  const firstNodeConfig = configs[0]
  const replacingFirstConfig = firstNodeConfig.id === newConfig.id && firstNodeConfig.type === newConfig.type
  // Delete the section of the tree we're about to (re)initialise so that any new branches have default data
  const obscuredTreeData = pathUtils.deleteAtGlobalPath(treeData, path)
  console.log('Initialising branch...')
  await treeDataInitialiser(replacingFirstConfig ? newConfig : firstNodeConfig, path, (path: Array<PathSegment>) => {
    const result = pathUtils.getValueByGlobalPath(obscuredTreeData, path, 'miss-865ed8ba-eee0-4914-b192-4e5927ad819b')
    if(result === 'miss-865ed8ba-eee0-4914-b192-4e5927ad819b') return
    return result
  })
  console.log('Initialised branch')
}