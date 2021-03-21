/***
 * TODO: This module makes some pretty nasty data mutations. Fix that.
 */

import { atom, RecoilState } from "recoil";
import { PathSegment } from "@graphter/core";
import { nanoid } from "nanoid";

const propStatePathMap = new Map<string, RecoilState<any>>()

const pathToKey = (path: Array<PathSegment>) => path.join('[88484d0d-33e8-47b4-a351-7bb581268da3]')

export const get = (
  path: Array<PathSegment>
): RecoilState<any> | null => {
  checkPathArg(path)
  return propStatePathMap.get(pathToKey(path)) || null
}

export const set = (
  path: Array<PathSegment>,
  committed: boolean,
  originalValue?: any
) => {
  checkPathArg(path)
  propStatePathMap.set(pathToKey(path), atom({
    key: nanoid(),
    default: originalValue
  }))
}

export const has = (path: Array<string | number>): boolean => {
  checkPathArg(path)
  return propStatePathMap.has(pathToKey(path))
}

export const remove = (path: Array<PathSegment>) => {
  checkPathArg(path)
  propStatePathMap.delete(pathToKey(path))
}


function checkPathArg(path: Array<PathSegment>){
  if(!path || !path.length) throw new Error('Path of at least one segment is required')
}

export interface PropDataStore {
  get: (path: Array<PathSegment>) => RecoilState<any> | null
  set: (
    path: Array<PathSegment>,
    committed: boolean,
    originalValue?: any
  ) => void
  has: (path: Array<string | number>) => boolean
  remove: (path: Array<PathSegment>) => void
}

export const propDataStore: PropDataStore = {
  get,
  set,
  has,
  remove
}

export default PropDataStore