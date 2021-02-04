import { RecoilValueReadOnly, selector } from "recoil";
import { NodeConfig, PathSegment } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";
import { propDataStore } from "./propDataStore";

const treeDataMap: { [key: string]: RecoilValueReadOnly<any> } = {};
const descendentPathDataMap: { [key: string]: RecoilValueReadOnly<Array<Array<PathSegment>>> } = {};

const treeKeySalt = 'c2c87429-dabf-4ea0-b2e1-6e7a6262bc11'
const descendentPathKeySalt = '04ea4750-019b-446d-87f4-c025f837ab7f'

export interface TreeDataStore {
  getDescendentData: (config: NodeConfig, path: Array<PathSegment>) => RecoilValueReadOnly<any>
  getDescendentPaths: (config: NodeConfig, path: Array<PathSegment>) => RecoilValueReadOnly<Array<Array<PathSegment>>>
}

const treeDataStore: TreeDataStore = {
  getDescendentData: (config, path) => {
    if(!config) throw new Error('Config is required to get descendent data')
    if(!path) throw new Error('Path is required to get descendent data')
    const key = `tree-from-${path.join(treeKeySalt)}`
    let treeDataSelector = treeDataMap[key]
    if(treeDataSelector) return treeDataSelector

    treeDataMap[key] = treeDataSelector = selector<any>({
      key: key,
      get: ({ get }) => {
        const getNodeValue = (path:Array<PathSegment>) => {
          const state = propDataStore.get(path)
          return get(state)
        }
        const renderer = nodeRendererStore.get(config.type)
        if(!renderer) throw new Error(`Couldn't find renderer for type '${config.type}'`)

        return renderer.getChildData ?
          renderer.getChildData(config, path, getNodeValue) :
          getNodeValue(path)
      }
    });

    return treeDataSelector
  },

  getDescendentPaths: (config, path): RecoilValueReadOnly<Array<Array<PathSegment>>> => {
    if(!config) throw new Error('Config is required to get descendent data')
    if(!path) throw new Error('Path is required to get descendent data')
    const key = `descendent-paths-${path.join(descendentPathKeySalt)}`
    let descendentPathSelector = descendentPathDataMap[key]
    if(descendentPathSelector) return descendentPathSelector
    descendentPathDataMap[key] = descendentPathSelector = selector<any>({
      key: key,
      get: ({ get }) => {
        const renderer = nodeRendererStore.get(config.type)
        if(!renderer) throw new Error(`Couldn't find renderer for type '${config.type}'`)
        if(!renderer.getChildPaths) return [ [ config.id ] ]
        const childPaths = renderer.getChildPaths(config, path, (path:Array<PathSegment>) => {
          const state = propDataStore.get(path)
          return get(state)
        })
        return [ [config.id], ...childPaths ]
      }
    })
    return descendentPathSelector

  }
}

export default treeDataStore