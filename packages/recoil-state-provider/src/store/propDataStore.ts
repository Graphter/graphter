/***
 * TODO: This module makes some pretty nasty data mutations. Fix that.
 */

import { atom, RecoilState } from "recoil";
import { PathSegment } from "@graphter/core";
import { nanoid } from "nanoid";

interface PropDataStateMeta {
  state: RecoilState<any>,
  deleted: boolean,
  committed: boolean,
  default: any
}

interface Node {
  id: string | null,
  meta: PropDataStateMeta | null,
  children: Array<Node> | null
}

const propStateNodeTree: Array<Node> = []

export const init = (
  path: Array<PathSegment>,
  data: any
): void => {
  const init = (path: Array<PathSegment>, data: any) => {
    if(Array.isArray(data)) {
      if(!has(path)) set(path, true, data.map(() => nanoid()))
      data.forEach((item, i) => init([ ...path, i ], item))
    } else if(typeof data === 'object') {
      if(!has(path)) set(path, true, data)
      Object.entries(data).forEach(([key, value]) => {
        init([ ...path, key ], value)
      })
    } else {
      if(!has(path)) set(path, true, data)
    }
  }
  init(path, data)
}

export const get = (
  path: Array<PathSegment>
): RecoilState<any> => {
  checkPathArg(path)
  const pathNode = getPathNode(path)
  if(!pathNode.meta) throw new Error(`Couldn't find state at ${path.join('/')}`)
  return pathNode.meta.state
}

export const getAll = (
  path: Array<PathSegment>
): Array<RecoilState<any>> => {
  checkPathArg(path)
  const pathNode = getPathNode(path)
  if(!pathNode.children) throw new Error(`Couldn't find child state at ${path.join('/')}`)
  return Array.from(pathNode.children.values())
    .filter(node => node.meta && node.meta.committed)
    .map(node => node.meta?.state as RecoilState<any>)
}

export const set = (
  path: Array<PathSegment>,
  committed: boolean,
  originalValue?: any
) => {
  checkPathArg(path)
  console.info(`Setting ${path.join('/')} = ${originalValue} [committed=${committed}]`)
  const node = getPathNode(path)
  node.meta = {
    state: atom({
      key: nanoid(),
      default: originalValue
    }),
    deleted: false,
    committed,
    default: originalValue
  }
}

/***
 * The "committed" flag in Graphter is used to demarcate draft tree additions. For example
 * the "add item" ui for a list before the "Add [+]" button is pressed.
 *
 * In future we'll likely have to integrate this function with node modification history or
 * versioning to allow us to track tree modifications as well as additions. For example a
 * renderer may want to allow changes and then provide a Save/Cancel button to commit or
 * discard the tree changes
 * @param path
 */
export const commitItem = (
  path: Array<PathSegment>
) => {
  checkPathArg(path)
  const node = getPathNode(path)
  if(!node.meta) throw new Error(`Node at ${path.join('/')} is missing meta. Should never happen`)
  node.meta.committed = true
}

export const has = (path: Array<string | number>): boolean => {
  checkPathArg(path)
  let node: Node | undefined = {
    id: null,
    meta: null,
    children: propStateNodeTree
  }
  for(let segment of path){
    if(typeof segment === 'string'){
      node = node.children?.find(childNode => childNode.id === segment)
    } else {
      node = node.children ? node.children[segment] : undefined
    }

    if(!node) return false
  }
  return true
}

export const remove = (path: Array<PathSegment>) => {
  checkPathArg(path)
  const clonedPath = [...path]
  const removeSegment = clonedPath.splice(-1, 1)[0]

  const parentNode = getPathNode(clonedPath)
  if(!parentNode) throw new Error(`Missing ancestor trying to set ${path.join('/')}`)
  if(!parentNode.children) throw new Error(`No children at ${path.join('/')} to remove`)
  const indexToRemove = typeof removeSegment === 'number' ?
    removeSegment :
    parentNode.children
      .findIndex(childNode => childNode.id !== removeSegment)
  parentNode.children.splice(indexToRemove, 1)
}

const getPathNode = (path: Array<PathSegment>) => {
  return path.reduce<Node>((a, c) => {
    if(!a.children) a.children = []
    let node = typeof c === 'string' ?
      a.children.find(node => node.id === c) :
      a.children[c]

    if(!node){
      node = {
        id: typeof c === 'string' ? c : null,
        meta: null,
        children: null
      }
      typeof c === 'string' ?
        a.children.push(node) :
        a.children[c] = node
    }
    return node
  }, { id: null, meta: null, children: propStateNodeTree })
}

function checkPathArg(path: Array<PathSegment>){
  if(!path || !path.length) throw new Error('Path of at least one segment is required')
}

export interface PropDataStore {
  init: (path: Array<PathSegment>, data: any) => void
  get: (path: Array<PathSegment>) => RecoilState<any>
  getAll: (path: Array<PathSegment>) => Array<RecoilState<any>>
  set: (
    path: Array<PathSegment>,
    committed: boolean,
    originalValue?: any
  ) => void
  commitItem: (path: Array<PathSegment>) => void
  has: (path: Array<string | number>) => boolean
  remove: (path: Array<PathSegment>) => void
}

export const propDataStore: PropDataStore = {
  init,
  get,
  getAll,
  set,
  commitItem,
  has,
  remove
}

export default PropDataStore