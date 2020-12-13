import { useRecoilValue } from "recoil";
import modelDataStore from "../store/modelDataStore";
import { PathSegment } from "@graphter/core";
import { TreePathsHook } from "./NodeDataProvider";

export const useRecoilTreePaths:TreePathsHook = (path: Array<PathSegment>) => {
  return useRecoilValue(modelDataStore.getDescendentPaths(path))
}