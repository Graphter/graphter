import { useRecoilState } from "recoil";
import { nodeConfigSetsStore } from "../store/nodeConfigSetsStore";
import { NodeConfigsHook } from "@graphter/renderer-react";
import { NodeConfig } from "@graphter/core";
import { getConfigSetKey } from "../utils/getConfigSetKey";
import { useRecoilTreeDataInitialiser } from "./useRecoilTreeDataInitialiser";
import { useRecoilTreeDataCallback } from "./useRecoilTreeDataCallback";

/**
 * @param path
 */
export const useRecoilNodeConfigs: NodeConfigsHook = (
  path,
) => {
  const nodeConfigSetsState = nodeConfigSetsStore.get(path)
  if (!nodeConfigSetsState) throw new Error(`Missing configs state at '${path.join('/')}'`)

  const [ nodeConfigSets, setNodeConfigs ] = useRecoilState(nodeConfigSetsState)
  const configs = nodeConfigSets.configSets.get(nodeConfigSets.activeConfigsKey)
  if(!configs) throw new Error(`No active configs found at '${path.join('/')}'`)
  const treeDataInitialiser = useRecoilTreeDataInitialiser()
  const initialiseBranch = useRecoilTreeDataCallback<Array<Array<NodeConfig>>>((treeData, newConfigs) => {
    treeDataInitialiser(newConfigs[0], path, treeData)
  }, path.slice(0, 2))
  return [
    configs,
    (newConfigs: Array<NodeConfig>) => {
      if(!newConfigs.length) throw new Error(`Trying to set zero configs at '${path.join('.')}'`)
      const configSetKey = getConfigSetKey(newConfigs)
      if(!nodeConfigSets.configSets.has(configSetKey)){
        nodeConfigSets.configSets.set(configSetKey, newConfigs)
        nodeConfigSets.activeConfigsKey = configSetKey
        setNodeConfigs(nodeConfigSets)
        initialiseBranch(newConfigs)
      }
    }
  ]
}