import { useRecoilValue } from "recoil";
import { TreeDataHook } from "@graphter/renderer-react";
import treeDataStore from "../store/treeDataStore";

export const useRecoilTreeData: TreeDataHook = (config, path, depth) => {
  return useRecoilValue(treeDataStore.getBranchData(config, path, depth))
}