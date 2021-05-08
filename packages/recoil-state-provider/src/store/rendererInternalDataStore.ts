import { atom, RecoilState } from "recoil";
import { NodeConfig, PathSegment } from "@graphter/core";
import { pathToKey } from "@graphter/renderer-react";

const pathInternalDataMap = new Map<string, RecoilState<any>>()

const getKey = (path: Array<PathSegment>, config: NodeConfig) => {
  return `renderer-internal-data-store-${pathToKey(path)}-01bdfbbf-40e7-4c72-a454-f61d9d51ea98-${config.id}`
}

export const get = <T>(
  path: Array<PathSegment>,
  config: NodeConfig
): RecoilState<T> | null => {
  checkPathArg(path)
  const key = getKey(path, config)
  if(!pathInternalDataMap.has(key)) return null
  const state = pathInternalDataMap.get(key)
  if(typeof state === 'undefined') throw new Error('Should not happen')
  return state
}

export const set = <T>(
  path: Array<PathSegment>,
  config: NodeConfig,
  internalData: T
) => {
  console.log(`Setting internal state for path '${path.join('/')}'[${config.id}:${config.type}] to ${JSON.stringify(internalData)}`)
  checkPathArg(path)

  const key = getKey(path, config)

  if(pathInternalDataMap.has(key)) throw new Error(`Internal path data already exists for '${path.join('/')}'`)

  pathInternalDataMap.set(key, atom({
    key: key,
    default: internalData
  }))
}

export const has = (path: Array<string | number>, config: NodeConfig): boolean => {
  checkPathArg(path)
  return pathInternalDataMap.has(getKey(path, config))
}

export const remove = (path: Array<PathSegment>, config: NodeConfig) => {
  checkPathArg(path)
  pathInternalDataMap.delete(getKey(path, config))
}


function checkPathArg(path: Array<PathSegment>){
  if(!path || !path.length) throw new Error('Path of at least one segment is required')
}

export const rendererInternalDataStore = {
  get,
  set,
  has,
  remove
}