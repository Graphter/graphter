import { atom, RecoilState } from "recoil";
import { NodeConfig, PathSegment } from "@graphter/core";
import { pathToKey } from "@graphter/renderer-react";
import { pathConfigsToString } from '../utils/pathConfigsToString';

let childPathsMap = new Map<string, RecoilState<Array<any>>>()

const getKey = (path: Array<PathSegment>, pathConfigs: Array<Array<NodeConfig>>) =>
  `path-children-store-a4d28666-5de8-4825-bcda-b1b6d116abe8-${
  pathToKey(path)
}${
  pathConfigsToString(pathConfigs, '2ad4b3e3-015f-48da-85ad-baa88944e682', 'fb57e733-b84c-46f9-b65c-d49a8554c24a')
}`

export const get = (
  path: Array<PathSegment>,
  pathConfigs: Array<Array<NodeConfig>>
): RecoilState<Array<any>> => {
  const key = getKey(path, pathConfigs)
  if(!childPathsMap.has(key)){
    console.log(`Initialising path '${path.join('/')}' with no children`)
    set(path, pathConfigs, [])
  }
  const state = childPathsMap.get(key)
  if(typeof state === 'undefined') throw new Error('Should not happen')
  return state
}

export const set = (
  parentPath: Array<PathSegment>,
  parentPathConfigs: Array<Array<NodeConfig>>,
  childPaths: Array<Array<PathSegment>>
) => {

  const pathKey = getKey(parentPath, parentPathConfigs)
  if(childPathsMap.has(pathKey)) throw new Error(`Tree path state already exists for '${parentPath.join('/')}'`)
  childPathsMap.set(pathKey, atom({
    key: pathKey,
    default: childPaths
  }))
}

export const has = (parentPath: Array<PathSegment>, pathConfigs: Array<Array<NodeConfig>>): boolean => {
  return childPathsMap.has(getKey(parentPath, pathConfigs))
}

export const remove = (parentPath: Array<PathSegment>, pathConfigs: Array<Array<NodeConfig>>) => {
  childPathsMap.delete(getKey(parentPath, pathConfigs))
}

export const pathChildrenStore = {
  get,
  set,
  has,
  remove,
}