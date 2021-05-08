import { atom, RecoilState } from "recoil";
import { PathSegment } from "@graphter/core";
import { pathToKey } from "@graphter/renderer-react";

const childPathsMap = new Map<string, RecoilState<Array<any>>>()

const getKey = (path: Array<PathSegment>) => `path-children-store-a4d28666-5de8-4825-bcda-b1b6d116abe8-${pathToKey(path)}`

export const get = (
  path: Array<PathSegment>
): RecoilState<Array<any>> => {
  const key = getKey(path)
  if(!childPathsMap.has(key)) throw new Error(`Couldn't find path children state at '${path.join('/')}'`)
  const state = childPathsMap.get(key)
  if(typeof state === 'undefined') throw new Error('Should not happen')
  return state
}

export const set = (
  parentPath: Array<PathSegment>,
  childPaths: Array<Array<PathSegment>>
) => {

  const pathKey = getKey(parentPath)

  if(childPathsMap.has(pathKey)) throw new Error(`Tree path state already exists for '${parentPath.join('/')}'`)

  childPathsMap.set(pathKey, atom({
    key: pathKey,
    default: childPaths
  }))
}

export const has = (parentPath: Array<string | number>): boolean => {
  return childPathsMap.has(getKey(parentPath))
}

export const remove = (parentPath: Array<PathSegment>) => {
  childPathsMap.delete(getKey(parentPath))
}

export const pathChildrenStore = {
  get,
  set,
  has,
  remove
}