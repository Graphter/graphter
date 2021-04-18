import { RecoilValueReadOnly, selector } from "recoil";
import { NodeConfig, PathSegment } from "@graphter/core";
import { propDataStore } from "./propDataStore";
import { getTreeData, getTreePaths } from "@graphter/renderer-react";

const treeDataMap: { [key: string]: RecoilValueReadOnly<any> } = {};
const descendentPathDataMap: { [key: string]: RecoilValueReadOnly<Array<Array<PathSegment>>> } = {};

const treeKeySalt = 'c2c87429-dabf-4ea0-b2e1-6e7a6262bc11'
const descendentPathKeySalt = '04ea4750-019b-446d-87f4-c025f837ab7f'

export interface TreeDataStore {
  getBranchData: (config: NodeConfig, path: Array<PathSegment>, depth?: number) => RecoilValueReadOnly<any>
  getBranchPaths: (config: NodeConfig, path: Array<PathSegment>) => RecoilValueReadOnly<Array<Array<PathSegment>>>
}

const treeDataStore: TreeDataStore = {
  getBranchData: (config, path, depth) => {
    if(!config) throw new Error('Config is required to get descendent data')
    if(!path) throw new Error('Path is required to get descendent data')
    const key = `tree-from-${path.join(treeKeySalt)}`
    let treeDataSelector = treeDataMap[key]
    if(treeDataSelector) return treeDataSelector

    treeDataMap[key] = treeDataSelector = selector<any>({
      key: key,
      get: async ({ get }) => {
        const treeData = await getTreeData(config, path, (path:Array<PathSegment>) => {
          const state = propDataStore.get(path)
          return get(state)
        }, depth)
        return treeData
      }
    });

    return treeDataSelector
  },

  getBranchPaths: (config, path): RecoilValueReadOnly<Array<Array<PathSegment>>> => {
    if(!config) throw new Error('Config is required to get descendent data')
    if(!path) throw new Error('Path is required to get descendent data')
    const key = `descendent-paths-${path.join(descendentPathKeySalt)}`
    let descendentPathSelector = descendentPathDataMap[key]
    if(descendentPathSelector) return descendentPathSelector
    descendentPathDataMap[key] = descendentPathSelector = selector<any>({
      key: key,
      get: ({ get }) => {
        return getTreePaths(config, path, (path:Array<PathSegment>) => {
          const state = propDataStore.get(path)
          return get(state)
        })
      }
    })
    return descendentPathSelector

  }
}

export default treeDataStore