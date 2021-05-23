import { atom, RecoilState } from "recoil";
import { NodeConfig, PathSegment } from "@graphter/core";
import { pathToKey } from "@graphter/renderer-react";

export interface NodeConfigSets {
  activeConfigsKey: string,
  configSets: Map<string, Array<NodeConfig>>
}

const pathNodeConfigMap = new Map<string, RecoilState<NodeConfigSets>>()

const getPathKey = (path: Array<PathSegment>) => `node-configs-store-a12b32f8-ecb8-4522-bc9a-f1ab8a59caae-${pathToKey(path)}`

export const get = (
  path: Array<PathSegment>
): RecoilState<NodeConfigSets> => {
  checkPathArg(path)
  const key = getPathKey(path)
  if(!pathNodeConfigMap.has(key)) throw new Error(`Couldn't find configs for node at '${path.join('/')}'`)
  const state = pathNodeConfigMap.get(key)
  if(typeof state === 'undefined') throw new Error('Should not happen')
  return state
}

export const set = (
  path: Array<PathSegment>,
  configSets: NodeConfigSets
) => {
  checkPathArg(path)
  const pathKey = getPathKey(path)
  if(pathNodeConfigMap.has(pathKey)) throw new Error(`A value is already set for '${path.join('/')}'`)
  pathNodeConfigMap.set(pathKey, atom({
    key: pathKey,
    default: configSets
  }))
}

export const has = (path: Array<string | number>): boolean => {
  checkPathArg(path)
  return pathNodeConfigMap.has(getPathKey(path))
}

export const remove = (path: Array<PathSegment>) => {
  checkPathArg(path)
  pathNodeConfigMap.delete(getPathKey(path))
}


function checkPathArg(path: Array<PathSegment>){
  if(!path || !path.length) throw new Error('Path of at least one segment is required')
}

export const nodeConfigSetsStore = {
  get,
  set,
  has,
  remove
}