import { TreeDataInitialiserHook } from "@graphter/renderer-react";

import { nodeRendererStore } from "@graphter/renderer-react";
import { pathToKey } from "@graphter/renderer-react";
import { nodeConfigSetsStore } from "../store/nodeConfigSetsStore";
import { rendererInternalDataStore } from "../store/rendererInternalDataStore";
import { pathChildrenStore } from "../store/pathChildrenStore";
import { getConfigSetKey } from "../utils/getConfigSetKey";
import { RecoilValue, SetRecoilState, useGotoRecoilSnapshot, useRecoilCallback } from "recoil";
import { NodeConfig, NodeInitialisationData, PathSegment } from "@graphter/core";
import { getPathPaths } from "../utils/getPathPaths";
import { pathConfigsStore } from "../store/pathConfigsStore";

export const useRecoilTreeDataInitialiser: TreeDataInitialiserHook = () => {
  const gotoSnapshot = useGotoRecoilSnapshot();
  const initialiseTreeData = useRecoilCallback(({snapshot}) =>
    async (config: NodeConfig, path: Array<PathSegment>, treeData: any) => {

      const newSnapshot = await snapshot.asyncMap(async ({set}) => {
        console.log(`Initialising branch at '${path.join('/')}' starting with config: ${config.id}`)
        const rendererRegistration = nodeRendererStore.get(config.type)
        if (!rendererRegistration?.initialiser) return
        const initData = await rendererRegistration.initialiser(treeData, config, path)
        // Must occur in this order because they each depend on the previous init being completed
        await initialiseNodeConfigSets(initData, snapshot.getPromise, set)
        await initialiseRendererInternalData(initData, snapshot.getPromise, set)
        await initialisePathChildren(initData, snapshot.getPromise, set)
        console.log(`Initialised branch at '${path.join('/')}' starting with config: ${config.id}`)
      })

      gotoSnapshot(newSnapshot)

    }, [])

  return async (config, path, treeData) => {
    return initialiseTreeData(config, path, treeData)
  }
}

async function initialiseNodeConfigSets(
  initData: Array<NodeInitialisationData>,
  get: <T>(recoilValue: RecoilValue<T>) => Promise<T>,
  set: SetRecoilState
) {
  const pathsMetaMap = initData.reduce((a, c) => {
    const pathKey = pathToKey(c.path)
    const pathMeta = a.get(pathKey)
    const node: PathMetaNode = {
      config: c.config,
      internalData: c.internalData
    }
    if (!pathMeta) a.set(pathKey, {
      path: c.path,
      nodes: [ node ],
      childPaths: []
    })
    else pathMeta.nodes.push(node)
    return a
  }, new Map<string, PathMeta>())

  await Promise.all(Array.from(pathsMetaMap.values()).map(async (meta) => {
    const configs = meta.nodes.map(node => node.config)
    const activeConfigsKey = getConfigSetKey(configs)
    if (nodeConfigSetsStore.has(meta.path)) {
      // There's some existing state in the store so check if it's the same as the incoming state
      const nodeConfigSetsState = nodeConfigSetsStore.get(meta.path)
      const nodeConfigSets = await get(nodeConfigSetsState)
      if (nodeConfigSets.activeConfigsKey !== activeConfigsKey) {
        // Incoming state is different so add new config set and mark as active
        nodeConfigSets.configSets.set(activeConfigsKey, configs)
        set(nodeConfigSetsState, {
          activeConfigsKey,
          configSets: nodeConfigSets.configSets
        })
      }
    } else {
      nodeConfigSetsStore.set(meta.path, {
        activeConfigsKey,
        configSets: new Map([ [ activeConfigsKey, configs ] ])
      })
    }
  }))
}

async function initialiseRendererInternalData(
  initData: Array<NodeInitialisationData>,
  get: <T>(recoilValue: RecoilValue<T>) => Promise<T>,
  set: SetRecoilState
) {
  await Promise.all(initData.map(async (nodeInitData) => {
    const pathConfigs = await get(pathConfigsStore.get(nodeInitData.path))
    if (!pathConfigs) throw new Error(`Couldn't find configs for path '${nodeInitData.path.join('/')}'`)
    if (rendererInternalDataStore.has(nodeInitData.path, pathConfigs)) {
      const internalDataState = rendererInternalDataStore.get(nodeInitData.path, pathConfigs)
      if (!internalDataState) return
      set(internalDataState, nodeInitData.internalData)
    } else {
      rendererInternalDataStore.set(nodeInitData.path, pathConfigs, nodeInitData.internalData)
    }
  }))
}

async function initialisePathChildren(
  initData: Array<NodeInitialisationData>,
  get: <T>(recoilValue: RecoilValue<T>) => Promise<T>,
  set: SetRecoilState
) {
  const pathChildren = await initData.reduce<Promise<Map<string, { path: Array<PathSegment>, children: Array<Array<PathSegment>> }>>>(
    async (aPromise, c) => {
      if(c.path.length <= 2) return aPromise
      const a = await aPromise
      const parentPath = c.path.slice(0, -1)
      console.log(`Path ${parentPath.join('/')} has child path ${c.path.join('/')}`)
      const parentPathKey = pathToKey(parentPath)
      if(!a.has(parentPathKey)) a.set(parentPathKey, { path: parentPath, children: [ c.path ] })
      else a.get(parentPathKey)?.children.push(c.path)
      return a
    }, Promise.resolve(new Map()))
  await Promise.all(Array.from(pathChildren.values()).map(async ({ path, children }) => {
    if (!pathChildrenStore.has(path)) {
      pathChildrenStore.set(path, children)
    } else {
      const childPathsState = pathChildrenStore.get(path)
      set(childPathsState, children)
    }
  }))
}

export interface PathMeta {
  path: Array<PathSegment>,
  nodes: Array<PathMetaNode>,
  childPaths: Array<Array<PathSegment>>
}

export interface PathMetaNode {
  internalData?: any,
  config: NodeConfig
}