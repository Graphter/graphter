import { useRecoilState, useRecoilValue } from "recoil";
import { ChildPathsHook } from "@graphter/renderer-react";
import { pathChildrenStore } from "../store/pathChildrenStore";
import { PathSegment } from "@graphter/core";
import { useRecoilTreeDataInitialiser } from "./useRecoilTreeDataInitialiser";
import { useRecoilNodeConfigs } from "./useRecoilNodeConfigs";
import { useRecoilTreeDataCallback } from "./useRecoilTreeDataCallback";
import { pathConfigsStore } from '../store/pathConfigsStore';

/**
 * @param path
 */
export const useRecoilChildPaths: ChildPathsHook = (
  path,
) => {
  const pathConfigs = useRecoilValue(pathConfigsStore.get(path))
  const childPathsState = pathChildrenStore.get(path, pathConfigs)
  if(!childPathsState) throw new Error(`Missing child paths state at '${path.join('/')}'`)
  const [ childPaths, setChildPaths ] = useRecoilState(childPathsState)
  const configs = useRecoilNodeConfigs(path)
  if(!configs.length) throw new Error(`No configs found at '${path.join('/')}'`)

  const treeDataInitialiser = useRecoilTreeDataInitialiser()
  return [ childPaths, async (childPaths: Array<Array<PathSegment>>) => {
    await treeDataInitialiser(configs[0], path)
    setChildPaths(childPaths)
  }]
}