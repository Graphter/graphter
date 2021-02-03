import { useRecoilCallback } from "recoil";
import { TreeDataHook } from "@graphter/renderer-react";
import treeDataStore from "../store/treeDataStore";

export const useRecoilTreeData: TreeDataHook = (fn, config, path) => {
  return useRecoilCallback(({snapshot}) => async () => {
    fn(await snapshot.getPromise(treeDataStore.getDescendentData(config, path)))
  })
}