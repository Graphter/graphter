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

export const get = (
  path: Array<PathSegment>
): RecoilState<any> => {
  const pathNode = getPathNode(path)
  if(!pathNode.meta) throw new Error(`Couldn't find state at ${path.join('/')}`)
  return pathNode.meta.state
}

export const getAll = (
  path: Array<PathSegment>
): Array<RecoilState<any>> => {
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
  if(!path || !path.length) throw new Error('Path of at least one segment is required')
  console.log(`Setting ${path.join('/')} = ${originalValue} [committed=${committed}`)
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

export const commitItem = (
  path: Array<PathSegment>
) => {
  if(!path || !path.length) throw new Error('Path of at least one segment is required')
  const node = getPathNode(path)
  if(!node.meta) throw new Error('Node is missing meta. Should never happen')
  node.meta.committed = true
}

export const has = (path: Array<string | number>): boolean => {
  if(!path || !path.length) throw new Error('Path of at least one segment is required')
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

export const remove = (path: Array<string | number>) => {
  if(!path || !path.length) throw new Error('Path of at least one segment is required')
  const clonedPath = [...path]
  const removeSegment = clonedPath.splice(-1, 1)[0]

  const parentNode = getPathNode(clonedPath)
  if(!parentNode) throw new Error(`Missing ancestor trying to set ${path.join('/')}`)
  if(!parentNode.children) throw new Error(`No children at ${path.join('/')} to remove`)
  typeof removeSegment === 'string' ?
    parentNode.children = parentNode.children
      .filter(childNode => childNode.id !== removeSegment) :
    parentNode.children.splice(removeSegment, 1)
}

const getPathNode = (path: Array<string | number>) => {
  return path.reduce<Node>((a, c) => {
    if(!a) return a
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

export default {
  get,
  getAll,
  set,
  commitItem,
  has,
  remove
}