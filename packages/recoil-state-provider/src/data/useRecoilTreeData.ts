import { useRecoilValue } from "recoil";
import { TreeDataHook } from "@graphter/renderer-react";
import { PathSegment } from "@graphter/core";
import branchDataStore from "../store/branchDataStore";

export const useRecoilTreeData: TreeDataHook = <T>(path: Array<PathSegment>, depth?: number) => {
  return useRecoilValue<T>(branchDataStore.get<T>(path, depth))
}