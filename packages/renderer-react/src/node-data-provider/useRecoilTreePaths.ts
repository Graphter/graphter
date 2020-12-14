import { useRecoilValue } from "recoil";
import treeDataStore from "../store/treeDataStore";
import { PathSegment } from "@graphter/core";
import { TreePathsHook } from "./NodeDataProvider";

export const useRecoilTreePaths:TreePathsHook = (path: Array<PathSegment>) => {
  return useRecoilValue(treeDataStore.getDescendentPaths(path))
}