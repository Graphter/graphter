/**
 * WARNING: this file is being used directly in various places in the react renderer
 * which is against the principle that the renderer should be agnostic of state management choices.
 * TODO: refactor access to this module through a standardised interface
 */
import { RecoilValueReadOnly, selector } from "recoil";
import propDataStore from "./propDataStore";
import { JsonType, PathSegment } from "@graphter/core";
import * as nodeRendererStore from "./nodeRendererStore";

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
        function getNodeData(path: Array<PathSegment>){
          const nodeConfig = propDataStore.getConfig(path)
          const nodeRenderer = nodeRendererStore.get(nodeConfig.type)
          if(!nodeRenderer) throw new Error(`No renderer for '${nodeConfig.id}' node of type '${nodeConfig.type}'`)
          if(nodeRenderer.jsonType === JsonType.ARRAY){
            if(!nodeConfig.children) throw new Error(`'${nodeConfig.id}' seems to be an array type but has no child config. At least one is required.`)
            const nodeChildStates = propDataStore.getAll(path)
            const childData: Array<any> = nodeChildStates
              .map((childState, i) => {
                if(!childState) throw new Error('Missing state. Should not happen')
                return getNodeData([ ...path, i ])
              })
            return childData
          } else if(nodeRenderer.jsonType === JsonType.OBJECT){
            if(!nodeConfig.children) throw new Error(`'${nodeConfig.id}' seems to be an object type but has no child config. At least one is required.`)
            return nodeConfig.children?.reduce<{ [key: string]: any }>((a, c) => {
              a[c.id] = getNodeData([ ...path, c.id ])
              return a
            }, {})
          } else {
            const nodeState = propDataStore.get(path)
            return get(nodeState)
          }
        }
        return getNodeData(path)
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
      get: ({get}) => {
        function recordChildPaths(
          path: Array<PathSegment>,
          descendentPaths: Array<Array<PathSegment>> = []
        ): Array<Array<PathSegment>>{
          descendentPaths.push(path)
          const nodeConfig = propDataStore.getConfig(path)
          const nodeRenderer = nodeRendererStore.get(nodeConfig.type)
          if(!nodeRenderer) throw new Error(`No renderer for '${nodeConfig.id}' node of type '${nodeConfig.type}'`)
          if(nodeRenderer.jsonType === JsonType.ARRAY){
            if(!nodeConfig.children) throw new Error(`'${nodeConfig.id}' seems to be an array type but has no child config. At least one is required.`)
            const nodeChildStates = propDataStore.getAll(path)
            nodeChildStates.forEach((_ , i) => recordChildPaths([...path, i], descendentPaths))
          } else if(nodeRenderer.jsonType === JsonType.OBJECT){
            if(!nodeConfig.children) throw new Error(`'${nodeConfig.id}' seems to be an object type but has no child config. At least one is required.`)
            nodeConfig.children.forEach(childConfig => recordChildPaths([...path, childConfig.id], descendentPaths))
          }
          return descendentPaths
        }
        return recordChildPaths(path)
      }
    })
    return descendentPathSelector

  }
}