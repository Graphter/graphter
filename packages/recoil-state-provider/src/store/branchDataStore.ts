import { RecoilValueReadOnly, selector } from "recoil";
import { PathSegment } from "@graphter/core";
import { nodeConfigSetsStore } from "./nodeConfigSetsStore";
import { pathChildrenStore } from "./pathChildrenStore";
import { nodeRendererStore } from "@graphter/renderer-react";
import { rendererInternalDataStore } from "./rendererInternalDataStore";
import { pathToKey } from "@graphter/renderer-react";

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
        const pathConfigSetsState = nodeConfigSetsStore.get(path)
        const childPathsState = pathChildrenStore.get(path)
        if (!pathConfigSetsState) throw new Error(`Missing path config state at path ${path.join('/')}`)
        if (!childPathsState) throw new Error(`Missing child paths state at path ${path.join('/')}`)
        const pathConfigSets = get(pathConfigSetsState)
        const pathConfigs = pathConfigSets.configSets.get(pathConfigSets.activeConfigsKey)
        if(!pathConfigs) throw new Error(`Can't find active configs at '${path.join('/')}'`)
        const childPaths = get<Array<Array<PathSegment>>>(childPathsState)


        const childData = childPaths.length ?
          childPaths.map(childPath => getNodeData(childPath)) :
          null

        // transform from the bottom most path node -> up
        const externalNodeData = [ ...pathConfigs ].reverse().reduce<any>((a, c) => {
          const internalDataState = rendererInternalDataStore.get(path, c)
          if (!internalDataState) throw new Error(`Missing internal data for path '${path.join('/')}' node ${c.id}`)
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