import { propDataStore } from "../store/propDataStore";
import { TreeDataInitialiserHook } from "@graphter/renderer-react";

import { nodeRendererStore } from "@graphter/renderer-react";
import { PathMeta } from "@graphter/renderer-react";
import { pathToKey } from "@graphter/renderer-react";

export const useRecoilTreeDataInitialiser: TreeDataInitialiserHook = () => {
  return async (config, path, originalTreeData) => {

    const rendererRegistration = nodeRendererStore.get(config.type)
    if(!rendererRegistration?.initialiser) return
    const nodeMetas = await rendererRegistration.initialiser(originalTreeData, config, path)

    // Get meta for all paths in the tree
    const treeMetaMap = nodeMetas.reduce((a, c) => {
      const pathKey = pathToKey(c.path)
      const pathMeta = a.get(pathKey)
      const node = {
        config: c.config,
        rendererRegistration: nodeRendererStore.get(c.config.type),
        internalData: c.internalData
      }
      if(!pathMeta) a.set(pathKey, {
        path: c.path,
        nodes: [ node ],
        childPaths: []
      })
      else pathMeta.nodes.push(node)
      return a
    }, new Map<string, PathMeta>())

    const treeMetaMapValues = Array.from(treeMetaMap.values())

    // Hook up child paths
    treeMetaMapValues.forEach((pathMeta) => {
      if(pathMeta.path.length <= 2) return
      const parentKey = pathToKey(pathMeta.path.slice(0, -1))
      const parentMeta = treeMetaMap.get(parentKey)
      if(!parentMeta){
        throw new Error(`Couldn't find parent to path '${pathMeta.path.join('/')}'. Shouldn't happen.`)
      }
      console.log(`'${parentMeta.path.join('/')}' is parent of '${pathMeta.path.join('/')}'`)
      parentMeta.childPaths.push(pathMeta.path)
    })

    // Check for duplicates (TODO: Remove)
    treeMetaMapValues.reduce((a, c) => {
      const key = pathToKey(c.path)
      if(a.has(key)) throw new Error(`Found duplicate path '${c.path.join('/')}'`)
      else a.set(key, true)
      return a
    }, new Map<string, boolean>())

    // Store
    console.log(JSON.stringify(treeMetaMapValues))
    treeMetaMapValues.forEach((pathMeta) => {
      if(!propDataStore.has(pathMeta.path)) propDataStore.set(pathMeta)
    })

  }
}