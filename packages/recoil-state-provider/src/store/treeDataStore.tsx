import { RecoilValueReadOnly, selector } from "recoil";
import { PathSegment } from "@graphter/core";
import { pathConfigStore, nodeRendererStore } from "@graphter/renderer-react";
import { propDataStore } from "./propDataStore";

const treeDataMap: { [key: string]: RecoilValueReadOnly<any> } = {};
const descendentPathDataMap: { [key: string]: RecoilValueReadOnly<Array<Array<PathSegment>>> } = {};

const treeKeySalt = 'c2c87429-dabf-4ea0-b2e1-6e7a6262bc11'
const descendentPathKeySalt = '04ea4750-019b-446d-87f4-c025f837ab7f'

export interface TreeDataStore {
  getDescendentData: (path: Array<PathSegment>) => RecoilValueReadOnly<any>
  getDescendentPaths: (path: Array<PathSegment>) => RecoilValueReadOnly<Array<Array<PathSegment>>>
}

const treeDataStore: TreeDataStore = {
  getDescendentData: (path: Array<PathSegment>) => {
    const key = `tree-from-${path.join(treeKeySalt)}`
    let treeDataSelector = treeDataMap[key]
    if(treeDataSelector) return treeDataSelector

    treeDataMap[key] = treeDataSelector = selector<any>({
      key: key,
      get: ({ get }) => {
        const getNodeValue = (path:Array<PathSegment>) => {
          const state = propDataStore.get(path)
          return Promise.resolve(get(state))
        }
        const config = pathConfigStore.get(path)
        if(!config) throw new Error(`Couldn't find config for node at path '${path.join('/')}'`)
        const renderer = nodeRendererStore.get(config.type)
        if(!renderer) throw new Error(`Couldn't find renderer for type '${config.type}'`)

        return renderer.getChildData ?
          renderer.getChildData(path, getNodeValue) :
          getNodeValue(path)
      }
    });

    return treeDataSelector
  },

  getDescendentPaths: (path: Array<PathSegment>): RecoilValueReadOnly<Array<Array<PathSegment>>> => {
    const key = `descendent-paths-${path.join(descendentPathKeySalt)}`
    let descendentPathSelector = descendentPathDataMap[key]
    if(descendentPathSelector) return descendentPathSelector
    descendentPathDataMap[key] = descendentPathSelector = selector<any>({
      key: key,
      get: async ({ get }) => {
        const config = pathConfigStore.get(path)
        if(!config) throw new Error(`Couldn't find config for node at path '${path.join('/')}'`)
        const renderer = nodeRendererStore.get(config.type)
        if(!renderer) throw new Error(`Couldn't find renderer for type '${config.type}'`)
        if(!renderer.getChildPaths) return [ [ config.id ] ]
        const childPaths = await renderer.getChildPaths(path, (path:Array<PathSegment>) => {
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