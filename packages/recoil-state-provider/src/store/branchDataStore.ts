import { RecoilValueReadOnly, selector } from "recoil";
import { PathSegment } from "@graphter/core";
import { nodeConfigSetsStore } from "./nodeConfigSetsStore";
import { pathChildrenStore } from "./pathChildrenStore";
import { nodeRendererStore } from "@graphter/renderer-react";
import { rendererInternalDataStore } from "./rendererInternalDataStore";
import { pathToKey } from "@graphter/renderer-react";
import { pathConfigsStore } from "./pathConfigsStore";
import { getExactPathConfigs } from "../utils/getExactPathConfigs";
import { pathConfigsToString } from "../utils/pathConfigsToString";

const treeDataMap: Map<string, RecoilValueReadOnly<any>> = new Map()

const get = <T>(startingPath: Array<PathSegment>, depth?: number) => {
  if (!startingPath) throw new Error('Path is required to get descendent data')
  const key = pathToKey(startingPath)
  let treeDataSelector = treeDataMap.get(key)
  if (treeDataSelector) return treeDataSelector

  treeDataSelector = selector<T>({
    key: key,
    get: ({get}) => {
      function getNodeData(path: Array<PathSegment>): any {
        const nodeConfigSetsState = nodeConfigSetsStore.get(path)
        if (!nodeConfigSetsState) throw new Error(`Missing path config state at path ${path.join('/')}`)
        const nodeConfigSets = get(nodeConfigSetsState)
        const nodeConfigs = nodeConfigSets.configSets.get(nodeConfigSets.activeConfigsKey)
        if(!nodeConfigs) throw new Error(`Can't find active configs at '${path.join('/')}'`)

        function getChildData(){
          if(!pathChildrenStore.has(path)) return null
          const childPathsState = pathChildrenStore.get(path)
          if (!childPathsState) return null
          const childPaths = get<Array<Array<PathSegment>>>(childPathsState)
          return childPaths.length ?
            childPaths.map(childPath => getNodeData(childPath)) :
            null
        }

        const childData = getChildData()
        const pathConfigsState = pathConfigsStore.get(path)
        const pathConfigs = get(pathConfigsState)
        // transform from the bottom most path node -> up
        const externalNodeData = [ ...nodeConfigs ].reverse().reduce<any>((a, c) => {
          const exactPathConfigs = getExactPathConfigs(pathConfigs, c)
          const internalDataState = rendererInternalDataStore.get(path, exactPathConfigs)
          if (!internalDataState){
            throw new Error(`Missing internal data for ${
              pathConfigsToString(exactPathConfigs)
            } at path '${path.join('/')}' node ${c.id}`)
          }
          const internalData = get(internalDataState)
          const rendererReg = nodeRendererStore.get(c.type)
          const rendererInternalData = typeof internalData !== 'undefined' ? internalData : a
          if (!childData?.length || !rendererReg.mergeChildData) return rendererInternalData
          else return rendererReg.mergeChildData(c, path, rendererInternalData, getNodeData, childData)
        }, undefined)

        return externalNodeData
      }

      return getNodeData(startingPath)
    }
  });
  treeDataMap.set(key, treeDataSelector)

  return treeDataSelector
}

const has = (startingPath: Array<PathSegment>) => {
  if (!startingPath) throw new Error('Path is required to get descendent data')
  const key = pathToKey(startingPath)
  return treeDataMap.has(key)
}

export const branchDataStore = {
  get,
  has
}

export default branchDataStore