import { useRecoilState } from "recoil";
import { ChildPathsHook } from "@graphter/renderer-react";
import { pathChildrenStore } from "../store/pathChildrenStore";
import { NodeConfig, PathSegment } from "@graphter/core";
import { useRecoilTreeDataInitialiser } from "./useRecoilTreeDataInitialiser";
import { useRecoilNodeConfigs } from "./useRecoilNodeConfigs";
import { useRecoilTreeDataCallback } from "./useRecoilTreeDataCallback";

/**
 * @param path
 */
export const useRecoilChildPaths: ChildPathsHook = (
  path,
) => {
  const childPathsState = pathChildrenStore.get(path)
  if(!childPathsState) throw new Error(`Missing child paths state at '${path.join('/')}'`)
  const [ childPaths, setChildPaths ] = useRecoilState(childPathsState)
  const [ pathConfigs ] = useRecoilNodeConfigs(path)
  if(!pathConfigs.length) throw new Error(`No configs found at '${path.join('/')}'`)

  const treeDataInitialiser = useRecoilTreeDataInitialiser()
  const initialiseBranch = useRecoilTreeDataCallback((treeData) => {
    treeDataInitialiser(pathConfigs[0], path, treeData)
  }, path.slice(0, 2))

  return [ childPaths, (childPaths: Array<Array<PathSegment>>) => {
    setChildPaths(childPaths)
    initialiseBranch()
  }]
}