import { selector, RecoilValueReadOnly } from "recoil";
import { NodeConfig, PathSegment } from "@graphter/core";
import { pathToKey } from "@graphter/renderer-react";
import { getPathPaths } from "../utils/getPathPaths";
import { nodeConfigSetsStore } from "./nodeConfigSetsStore";

const pathConfigsMap = new Map<string, RecoilValueReadOnly<Array<Array<NodeConfig>>>>()

export const get = (
  path: Array<PathSegment>
): RecoilValueReadOnly<Array<Array<NodeConfig>>> => {
  const pathKey = `path-config-store-${pathToKey(path)}`
  let pathConfigsSelector = pathConfigsMap.get(pathKey)
  if(pathConfigsSelector) return pathConfigsSelector
  pathConfigsSelector = selector({
    key: pathKey,
    get: ({ get }) => {
      const pathPaths = getPathPaths(path)
      return pathPaths.reduce<Array<Array<NodeConfig>>>((a, c) => {
        const nodeConfigSetsState = nodeConfigSetsStore.get(c)
        const nodeConfigSets = get(nodeConfigSetsState)
        const configs = nodeConfigSets.configSets.get(nodeConfigSets.activeConfigsKey)
        if (configs) a.push(configs)
        return a
      }, [])
    }
  })
  pathConfigsMap.set(pathKey, pathConfigsSelector)
  return pathConfigsSelector
}

export const pathConfigsStore = {
  get,
}