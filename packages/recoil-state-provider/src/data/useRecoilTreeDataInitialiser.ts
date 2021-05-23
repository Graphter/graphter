import { TreeDataInitialiserHook } from "@graphter/renderer-react";

import { nodeRendererStore } from "@graphter/renderer-react";
import { pathToKey } from "@graphter/renderer-react";
import { nodeConfigSetsStore } from "../store/nodeConfigSetsStore";
import { rendererInternalDataStore } from "../store/rendererInternalDataStore";
import { pathChildrenStore } from "../store/pathChildrenStore";
import { getConfigSetKey } from "../utils/getConfigSetKey";
import { RecoilValue, SetRecoilState, useGotoRecoilSnapshot, useRecoilCallback } from "recoil";
import { NodeConfig, NodeInitialisationData, PathSegment } from "@graphter/core";
import { getExactPathConfigs } from "../utils/getExactPathConfigs";
import { pathConfigsToString } from "../utils/pathConfigsToString";

export const useRecoilTreeDataInitialiser: TreeDataInitialiserHook = () => {
  const gotoSnapshot = useGotoRecoilSnapshot();
  const initialiseTreeData = useRecoilCallback(({snapshot}) =>
    async (config: NodeConfig, path: Array<PathSegment>, treeData: any) => {

      console.log(`Initialising branch at '${path.join('/')}' starting with config: ${config.id}`)
      const rendererRegistration = nodeRendererStore.get(config.type)
      if (!rendererRegistration?.initialiser) return
      const initData = await rendererRegistration.initialiser(treeData, config, path)

      // Must occur in this order because they each depend on the previous init being completed

      let newSnapshot = await snapshot.asyncMap(async ({set}) => {
        await initialiseNodeConfigSets(initData, snapshot.getPromise, set)
      })

      newSnapshot = await newSnapshot.asyncMap(async ({set}) => {
        await initialiseRendererInternalData(initData, newSnapshot.getPromise, set)
      })

      newSnapshot = await newSnapshot.asyncMap(async ({set}) => {
        await initialisePathChildren(initData, newSnapshot.getPromise, set)
      })

      gotoSnapshot(newSnapshot)
      console.log(`Initialised branch at '${path.join('/')}' starting with config: ${config.id}`)

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
        const newConfigSets = new Map(nodeConfigSets.configSets)
        newConfigSets.set(activeConfigsKey, configs)
        set(nodeConfigSetsState, {
          activeConfigsKey,
          configSets: newConfigSets
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
  const pathConfigsMap = await initData.reduce<Promise<Map<string, Array<Array<NodeConfig>>>>>(
    async (aPromise, c) => {
      const a = await aPromise
      const localSegments = c.path.slice(2)
      const pathPaths = localSegments.reduce<Array<Array<PathSegment>>>((a, c) => {
        a.push([ ...a[a.length - 1], c ])
        return a
      }, [ c.path.slice(0, 2) ])
      const pathConfigs = await pathPaths.reduce<Promise<Array<Array<NodeConfig>>>>(async (aPromise, c) => {
        const a = await aPromise
        const nodeConfigSetsState = nodeConfigSetsStore.get(c)
        const nodeConfigSets = await get(nodeConfigSetsState)
        const configs = nodeConfigSets.configSets.get(nodeConfigSets.activeConfigsKey)
        if (configs) a.push(configs)
        return a
      }, Promise.resolve([]))
      a.set(pathToKey(c.path), pathConfigs)

      return a
    }, Promise.resolve(new Map()))
  await Promise.all(initData.map(async (nodeInitData) => {
    const allPathConfigs = pathConfigsMap.get(pathToKey(nodeInitData.path))
    if (!allPathConfigs?.length) throw new Error(`Couldn't find configs for path '${nodeInitData.path.join('/')}'`)
    const exactPathConfigs = getExactPathConfigs(allPathConfigs, nodeInitData.config)
    if (rendererInternalDataStore.has(nodeInitData.path, exactPathConfigs)) {
      const internalDataState = rendererInternalDataStore.get(nodeInitData.path, exactPathConfigs)
      if (!internalDataState) return
      console.log(`Changing internal node data at '${pathConfigsToString(exactPathConfigs)}' to `, nodeInitData)
      set(internalDataState, nodeInitData.internalData)
    } else {
      console.log(`Setting internal node data at '${pathConfigsToString(exactPathConfigs)}' to `, nodeInitData)
      rendererInternalDataStore.set(nodeInitData.path, exactPathConfigs, nodeInitData.internalData)
    }
  }))
}

async function initialisePathChildren(
  initData: Array<NodeInitialisationData>,
  get: <T>(recoilValue: RecoilValue<T>) => Promise<T>,
  set: SetRecoilState
) {
  const pathChildren = initData.reduce<Map<string, { path: Array<PathSegment>, children: Array<Array<PathSegment>> }>>(
    (a, c) => {
      if(c.path.length <= 2) return a
      const parentPath = c.path.slice(0, -1)
      console.log(`Path ${parentPath.join('/')} has child path ${c.path.join('/')}`)
      const parentPathKey = pathToKey(parentPath)
      if(!a.has(parentPathKey)) a.set(parentPathKey, { path: parentPath, children: [ c.path ] })
      else a.get(parentPathKey)?.children.push(c.path)
      return a
    }, new Map())
  Array.from(pathChildren.values()).forEach(({ path, children }) => {
    if (!pathChildrenStore.has(path)) {
      pathChildrenStore.set(path, children)
    } else {
      const childPathsState = pathChildrenStore.get(path)
      set(childPathsState, children)
    }
  })
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