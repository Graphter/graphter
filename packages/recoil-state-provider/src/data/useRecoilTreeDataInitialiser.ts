import { TreeDataInitialiserHook } from "@graphter/renderer-react";

import { nodeRendererStore } from "@graphter/renderer-react";
import { PathMeta } from "@graphter/renderer-react";
import { pathToKey } from "@graphter/renderer-react";
import { NodeConfigSets, nodeConfigSetsStore } from "../store/nodeConfigSetsStore";
import { rendererInternalDataStore } from "../store/rendererInternalDataStore";
import { pathChildrenStore } from "../store/pathChildrenStore";
import { getConfigSetKey } from "../utils/getConfigSetKey";
import { RecoilState, selector, useRecoilCallback } from "recoil";
import branchDataStore from "../store/branchDataStore";
import { NodeConfig, NodeInitialisationData, PathSegment } from "@graphter/core";

let initialiserSelector: RecoilState<boolean> | null = null

export const useRecoilTreeDataInitialiser: TreeDataInitialiserHook = () => {

  const initialiseTreeData = useRecoilCallback(({ snapshot, set }) =>
    async (config: NodeConfig, path: Array<PathSegment>, treeData: any) => {
      console.log(`Initialising branch at '${path.join('/')}'`)
      const rendererRegistration = nodeRendererStore.get(config.type)
      if (!rendererRegistration?.initialiser) return
      const initData = await rendererRegistration.initialiser(treeData, config, path)
      // Get meta for all paths in the tree
      const pathsMeta = getPathsMeta(initData)

      await Promise.all(pathsMeta.map(async (pathMeta) => {
        // Config state
        const configs = pathMeta.nodes.map(node => node.config)
        const activeConfigsKey = getConfigSetKey(configs)
        if(!nodeConfigSetsStore.has(pathMeta.path)){
          // This node hasn't been added to the state store yet
          nodeConfigSetsStore.set(pathMeta.path, {
            activeConfigsKey,
            configSets: new Map([ [ activeConfigsKey, configs ] ])
          })
        } else {
          // There's some existing state in the store so check if it's the same as the incoming state
          const nodeConfigSetsState = nodeConfigSetsStore.get(pathMeta.path)
          const nodeConfigSets = await snapshot.getPromise(nodeConfigSetsState)
          if(nodeConfigSets.activeConfigsKey !== activeConfigsKey){
            // Incoming state is different so add it and set it as active
            nodeConfigSets.configSets.set(activeConfigsKey, configs)
            set(nodeConfigSetsState, {
              activeConfigsKey,
              configSets: nodeConfigSets.configSets
            })
          }
        }
        // Internal data state
        pathMeta.nodes.map(node => {
          if (!rendererInternalDataStore.has(pathMeta.path, node.config)) {
            rendererInternalDataStore.set(pathMeta.path, node.config, node.internalData)
          }
        })
        // Child paths
        if (!pathChildrenStore.has(pathMeta.path)){
          pathChildrenStore.set(pathMeta.path, pathMeta.childPaths)
        } else {
          const childPathsState = pathChildrenStore.get(pathMeta.path)
          set(childPathsState, pathMeta.childPaths)
        }
      }))
      console.log(`Initialised branch at '${path.join('/')}'`)
    }, [])

  return async (config, path, treeData) => {
    return initialiseTreeData(config, path, treeData)
  }
}

function getPathsMeta(initData: Array<NodeInitialisationData>): Array<PathMeta> {
  const pathsMetaMap = initData.reduce((a, c) => {
    const pathKey = pathToKey(c.path)
    const pathMeta = a.get(pathKey)
    const node = {
      config: c.config,
      rendererRegistration: nodeRendererStore.get(c.config.type),
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

  const pathsMeta = Array.from(pathsMetaMap.values())

  // Hook up child paths
  pathsMeta.forEach((pathMeta) => {
    if (pathMeta.path.length <= 2) return
    const parentKey = pathToKey(pathMeta.path.slice(0, -1))
    const parentMeta = pathsMetaMap.get(parentKey)
    if (!parentMeta) {
      // This will happen when we're only initialising part of the tree.
      // Not a problem because the rest of the hierarchy is assumed to already be correctly initialised
      return
    }
    console.log(`'${parentMeta.path.join('/')}' is parent of '${pathMeta.path.join('/')}'`)
    parentMeta.childPaths.push(pathMeta.path)
  })

  return pathsMeta
}