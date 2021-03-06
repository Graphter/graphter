import { RecoilValueReadOnly, selector } from "recoil";
import { NodeConfig, PathSegment } from "@graphter/core";
import { propDataStore } from "./propDataStore";
import { getTreeData, getTreePaths } from "@graphter/renderer-react";

const treeDataMap: { [key: string]: RecoilValueReadOnly<any> } = {};
const descendentPathDataMap: { [key: string]: RecoilValueReadOnly<Array<Array<PathSegment>>> } = {};

const treeKeySalt = 'c2c87429-dabf-4ea0-b2e1-6e7a6262bc11'
const descendentPathKeySalt = '04ea4750-019b-446d-87f4-c025f837ab7f'

export interface TreeDataStore {
  getBranchData: (startingConfig: NodeConfig, startingPath: Array<PathSegment>, depth?: number) => RecoilValueReadOnly<any>
  getBranchPaths: (startingConfig: NodeConfig, startingPath: Array<PathSegment>) => RecoilValueReadOnly<Array<Array<PathSegment>>>
}

const treeDataStore: TreeDataStore = {
  getBranchData: (startingConfig, startingPath, depth) => {
    if(!startingConfig) throw new Error('Config is required to get descendent data')
    if(!startingPath) throw new Error('Path is required to get descendent data')
    const key = `tree-from-${startingPath.join(treeKeySalt)}`
    let treeDataSelector = treeDataMap[key]
    if(treeDataSelector) return treeDataSelector

    treeDataMap[key] = treeDataSelector = selector<any>({
      key: key,
      get: async ({ get }) => {
        const treeData = await getTreeData(startingConfig, startingPath, (path:Array<PathSegment>) => {
          const state = propDataStore.get(path)
          return get(state)
        }, depth)
        return treeData
      }
    });

    return treeDataSelector
  },

  getBranchPaths: (startingConfig, startingPath): RecoilValueReadOnly<Array<Array<PathSegment>>> => {
    if(!startingConfig) throw new Error('Config is required to get descendent data')
    if(!startingPath) throw new Error('Path is required to get descendent data')
    const key = `descendent-paths-${startingPath.join(descendentPathKeySalt)}`
    let descendentPathSelector = descendentPathDataMap[key]
    if(descendentPathSelector) return descendentPathSelector
    descendentPathDataMap[key] = descendentPathSelector = selector<any>({
      key: key,
      get: ({ get }) => {
        return getTreePaths(startingConfig, startingPath, (path:Array<PathSegment>) => {
          const state = propDataStore.get(path)
          return get(state)
        })
      }
    })
    return descendentPathSelector

  }
}

export default treeDataStore