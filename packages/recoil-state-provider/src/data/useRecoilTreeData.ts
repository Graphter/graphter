import { useRecoilValue } from "recoil";
import { TreeDataHook } from "@graphter/renderer-react";
import treeDataStore from "../store/treeDataStore";

export const useRecoilTreeData: TreeDataHook = (config, path) => {
  return useRecoilValue(treeDataStore.getDescendentData(config, path))
}