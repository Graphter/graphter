import { atom, RecoilState } from "recoil";
import { NodeConfig, PathSegment } from "@graphter/core";
import { pathToKey } from "@graphter/renderer-react";

const pathNodeConfigMap = new Map<string, RecoilState<Array<NodeConfig>>>()

const getKey = (path: Array<PathSegment>) => `node-configs-store-a12b32f8-ecb8-4522-bc9a-f1ab8a59caae-${pathToKey(path)}`

export const get = (
  path: Array<PathSegment>
): RecoilState<Array<NodeConfig>> | null => {
  checkPathArg(path)
  const key = getKey(path)
  if(!pathNodeConfigMap.has(key)) return null
  const state = pathNodeConfigMap.get(key)
  if(typeof state === 'undefined') throw new Error('Should not happen')
  return state
}

export const set = (
  path: Array<PathSegment>,
  configs: Array<NodeConfig>
) => {
  console.log(`Setting configs for path '${path.join('/')}' to ${JSON.stringify(configs)}`)
  checkPathArg(path)

  const pathKey = getKey(path)

  if(pathNodeConfigMap.has(pathKey)) throw new Error(`A value is already set for '${path.join('/')}'`)

  pathNodeConfigMap.set(pathKey, atom({
    key: pathKey,
    default: configs
  }))
}

export const has = (path: Array<string | number>): boolean => {
  checkPathArg(path)
  return pathNodeConfigMap.has(getKey(path))
}

export const remove = (path: Array<PathSegment>) => {
  checkPathArg(path)
  pathNodeConfigMap.delete(getKey(path))
}


function checkPathArg(path: Array<PathSegment>){
  if(!path || !path.length) throw new Error('Path of at least one segment is required')
}

export const nodeConfigsStore = {
  get,
  set,
  has,
  remove
}