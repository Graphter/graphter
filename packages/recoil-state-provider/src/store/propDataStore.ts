/***
 * TODO: This module makes some pretty nasty data mutations. Fix that.
 */

import { atom, RecoilState } from "recoil";
import { PathSegment } from "@graphter/core";
import { PathMeta } from "@graphter/renderer-react";
import { pathToKey } from "@graphter/renderer-react";

const propStatePathMap = new Map<string, RecoilState<PathMeta>>()

export const get = (
  path: Array<PathSegment>
): RecoilState<PathMeta> | null => {
  checkPathArg(path)
  const key = pathToKey(path)
  if(!propStatePathMap.has(key)) return null
  const state = propStatePathMap.get(key)
  if(typeof state === 'undefined') throw new Error('Should not happen')
  return state
}

export const set = (
  nodeMeta: PathMeta
) => {
  console.log(`Setting state '${nodeMeta.path.join('/')}' to ${JSON.stringify(nodeMeta.nodes)}`)
  checkPathArg(nodeMeta.path)

  if(has(nodeMeta.path)) throw new Error(`A value is already set for '${nodeMeta.path.join('/')}'`)
  propStatePathMap.set(pathToKey(nodeMeta.path), atom({
    key: pathToKey(nodeMeta.path),
    default: nodeMeta
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

export const propDataStore = {
  get,
  set,
  has,
  remove
}