import { RecoilValueReadOnly, selector } from "recoil";
import { NodeConfig, PathSegment } from "@graphter/core";
import { PathMeta } from "@graphter/renderer-react";
import { PathMetaNode } from "@graphter/renderer-react";
import { nodeConfigsStore } from "./nodeConfigsStore";
import { pathChildrenStore } from "./pathChildrenStore";
import { nodeRendererStore } from "@graphter/renderer-react";
import { rendererInternalDataStore } from "./rendererInternalDataStore";

const treeDataMap: { [key: string]: RecoilValueReadOnly<any> } = {};

const treeKeySalt = 'c2c87429-dabf-4ea0-b2e1-6e7a6262bc11'

export interface TreeDataStore {
  getBranchData: <T>(startingPath: Array<PathSegment>, depth?: number) => RecoilValueReadOnly<T>
}

const treeDataStore: TreeDataStore = {
  getBranchData: (startingPath, depth) => {
    if (!startingPath) throw new Error('Path is required to get descendent data')
    const key = `tree-from-${startingPath.join(treeKeySalt)}`
    let treeDataSelector = treeDataMap[key]
    if (treeDataSelector) return treeDataSelector

    treeDataMap[key] = treeDataSelector = selector<any>({
      key: key,
      get: async ({get}) => {
        async function getNodeData(path: Array<PathSegment>): Promise<any> {
          const pathConfigsState = nodeConfigsStore.get(path)
          const childPathsState = pathChildrenStore.get(path)
          if(!pathConfigsState) throw new Error(`Missing path config state at path ${path.join('/')}`)
          if(!childPathsState) throw new Error(`Missing child paths state at path ${path.join('/')}`)
          const pathConfigs = get<Array<NodeConfig>>(pathConfigsState)
          const childPaths = get<Array<Array<PathSegment>>>(childPathsState)



          const childData = childPaths.length ?
            await Promise.all(childPaths.map(childPath => getNodeData(childPath))):
            null

          // transform from the bottom most path node -> up
          const externalNodeData = [...pathConfigs].reverse().reduce<any>((a, c) => {
            const internalDataState = rendererInternalDataStore.get(path, c)
            if(!internalDataState) throw new Error(`Missing internal data for path '${path.join('/')}' node ${c.id}`)
            const internalData = get(internalDataState)
            const rendererReg = nodeRendererStore.get(c.type)
            const rendererInternalData = typeof internalData !== 'undefined' ? internalData : a
            if(!childData?.length || !rendererReg.mergeChildData) return rendererInternalData
            else return rendererReg.mergeChildData(c, path, rendererInternalData, getNodeData, childData)
          }, undefined)

          return externalNodeData
        }

        return await getNodeData(startingPath)
      }
    });

    return treeDataSelector
  },
}

export default treeDataStore

function getFirstEligibleNodeData(nodes: Array<PathMetaNode>): { config: NodeConfig, data: any; } | undefined{
  const eligibleNode = nodes.find(node => typeof node.internalData !== undefined)
  return eligibleNode ? {
    config: eligibleNode.config,
    data: eligibleNode.internalData
  } : undefined
}