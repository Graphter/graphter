import { useRecoilValue } from "recoil";
import { ChildPathsHook } from "@graphter/renderer-react";
import { pathChildrenStore } from "../store/pathChildrenStore";

/**
 * @param path
 */
export const useRecoilChildPaths: ChildPathsHook = (
  path,
) => {

  const childPathsState = pathChildrenStore.get(path)
  if(!childPathsState) throw new Error(`Missing child paths state at '${path.join('/')}'`)

  return useRecoilValue(childPathsState)
}