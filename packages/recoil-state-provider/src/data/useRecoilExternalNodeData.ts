import { useRecoilState, useRecoilValue } from "recoil";
import { propDataStore } from "../store/propDataStore";
import { ExternalNodeDataHook } from "@graphter/renderer-react";
import { PathMeta } from "@graphter/renderer-react";

/**
 * @param path
 */
export const useRecoilExternalNodeData: ExternalNodeDataHook = (
  path,
) => {

  let parentMeta: PathMeta | null = null
  let parentSetMeta: ((meta: PathMeta) => void) | null = null

  if(path.length > 2){
    // We can do this conditional because path is expected to be stable for this instance of the hook
    const parentState = propDataStore.get(path.slice(0, -1))
    if(!parentState) throw new Error('Parent state is expected to always have been stored before a child is processed')
    const parent = useRecoilState(parentState)
    parentMeta = parent[0]
    parentSetMeta = parent[1]
  }

  if(!propDataStore.has(path)){
    // Store meta for current path
    const pathMeta: PathMeta = {
      path,
      nodes: [],
      childPaths: []
    }
    propDataStore.set(pathMeta)

    if(path.length > 2 && parentMeta && parentSetMeta){
      // Add path to parent
      parentMeta = {
        ...parentMeta,
        childPaths: [
          ...parentMeta.childPaths,
          path
        ]
      }
      parentSetMeta(parentMeta)
    }
  }

  const propDataState = propDataStore.get(path)
  if(!propDataState) throw new Error('Should have state by now')


  const pathMeta = useRecoilValue<PathMeta>(propDataState)
  return pathMeta.nodes.find(node => typeof node.internalData !== 'undefined')?.internalData
}