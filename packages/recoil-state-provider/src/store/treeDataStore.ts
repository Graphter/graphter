/**
 * WARNING: this file is being used directly in various places in the react renderer
 * which is against the principle that the renderer should be agnostic of state management choices.
 * TODO: refactor access to this module through a standardised interface
 */
import { RecoilValueReadOnly, selector } from "recoil";
import propDataStore from "./propDataStore";
import { PathSegment } from "@graphter/core";
import { pathConfigStore, nodeRendererStore } from "@graphter/renderer-react";

const treeDataMap: { [key: string]: RecoilValueReadOnly<any> } = {};
const descendentPathDataMap: { [key: string]: RecoilValueReadOnly<Array<Array<PathSegment>>> } = {};

const modelKeySalt = 'c2c87429-dabf-4ea0-b2e1-6e7a6262bc11'
const descendentPathKeySalt = '04ea4750-019b-446d-87f4-c025f837ab7f'

export default {
  getDescendentData: (path: Array<PathSegment>) => {
    const key = `model-${path.join(modelKeySalt)}`
    let treeDataSelector = treeDataMap[key]
    if(treeDataSelector) return treeDataSelector

    treeDataMap[key] = treeDataSelector = selector<any>({
      key: key,
      get: ({ get }) => {
        const config = pathConfigStore.get(path)
        if(!config) throw new Error(`Couldn't find config for node at path '${path.join('/')}'`)
        const renderer = nodeRendererStore.get(config.type)
        if(!renderer) throw new Error(`Couldn't find renderer for type '${config.type}'`)
        return renderer.getRenderedData(path, (path:Array<PathSegment>) => {
          const state = propDataStore.get(path)
          return get(state)
        })
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
      get: ({ get }) => {
        const config = pathConfigStore.get(path)
        if(!config) throw new Error(`Couldn't find config for node at path '${path.join('/')}'`)
        const renderer = nodeRendererStore.get(config.type)
        if(!renderer) throw new Error(`Couldn't find renderer for type '${config.type}'`)
        if(!renderer.getPaths) return [ config.id ]
        const paths = renderer.getPaths(path, (path:Array<PathSegment>) => {
          const state = propDataStore.get(path)
          return get(state)
        })
        return paths
      }
    })
    return descendentPathSelector

  }
}