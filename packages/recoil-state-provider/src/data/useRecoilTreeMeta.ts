import { useRecoilValue } from "recoil";
import treeDataStore from "../store/treeDataStore";
import { TreeMetaHook } from "@graphter/renderer-react";
import { PathMeta } from "@graphter/renderer-react";

export const useRecoilTreeMeta: TreeMetaHook = (config, path) => {
  return useRecoilValue<Array<PathMeta>>(treeDataStore.getBranchMetas(config, path))
}