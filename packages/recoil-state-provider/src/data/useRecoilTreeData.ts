import { useRecoilValue } from "recoil";
import { TreeDataHook } from "@graphter/renderer-react";
import treeDataStore from "../store/treeDataStore";
import { PathSegment } from "@graphter/core";

export const useRecoilTreeData: TreeDataHook = <T>(path: Array<PathSegment>, depth?: number) => {
  return useRecoilValue<T>(treeDataStore.getBranchData<T>(path, depth))
}