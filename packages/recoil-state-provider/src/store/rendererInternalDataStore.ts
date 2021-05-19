import { atom, RecoilState } from "recoil";
import { NodeConfig, PathSegment } from "@graphter/core";
import { pathToKey } from "@graphter/renderer-react";
import { pathConfigsToString } from "../utils/pathConfigsToString";

const pathInternalDataMap = new Map<string, RecoilState<any>>()

const getKey = (path: Array<PathSegment>, pathConfigs: Array<Array<NodeConfig>>) => {
  return `renderer-internal-data-store-${
    pathToKey(path)
  }-01bdfbbf-40e7-4c72-a454-f61d9d51ea98-${
    pathConfigs
      .map(segmentConfigs => segmentConfigs
        .map(config => `${config.id}5f9c3140-cfaf-45b3-9484-6b5e58588c73${config.type}`)
        .join('a16485f9-1727-43fd-9f01-bb9f21751001')
      )
      .join('d2362d47-f476-4e1a-b2fe-77d13bb5dd3d')
  }`
}

export const get = <T>(
  path: Array<PathSegment>,
  pathConfigs: Array<Array<NodeConfig>>,
): RecoilState<T> | null => {
  checkPathArg(path)
  const key = getKey(path, pathConfigs)
  if (!pathInternalDataMap.has(key)) return null
  const state = pathInternalDataMap.get(key)
  if (typeof state === 'undefined') throw new Error('Should not happen')
  return state
}

export const set = <T>(
  path: Array<PathSegment>,
  pathConfigs: Array<Array<NodeConfig>>,
  internalData: T
) => {
  console.log(`Setting ${pathConfigsToString(pathConfigs)} state to ${JSON.stringify(internalData)}`)
  checkPathArg(path)

  const key = getKey(path, pathConfigs)

  if (pathInternalDataMap.has(key)) throw new Error(`Internal path data already exists for '${path.join('/')}'`)

  pathInternalDataMap.set(key, atom({
    key: key,
    default: internalData
  }))
}

export const has = (
  path: Array<string | number>,
  pathConfigs: Array<Array<NodeConfig>>,
): boolean => {
  checkPathArg(path)
  return pathInternalDataMap.has(getKey(path, pathConfigs))
}

export const remove = (
  path: Array<PathSegment>,
  pathConfigs: Array<Array<NodeConfig>>,
) => {
  checkPathArg(path)
  pathInternalDataMap.delete(getKey(path, pathConfigs))
}


function checkPathArg(path: Array<PathSegment>) {
  if (!path || !path.length) throw new Error('Path of at least one segment is required')
}

export const rendererInternalDataStore = {
  get,
  set,
  has,
  remove
}