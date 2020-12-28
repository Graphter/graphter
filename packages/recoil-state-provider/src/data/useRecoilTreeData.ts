import { useRecoilCallback } from "recoil";
import { TreeDataHook } from "@graphter/renderer-react";
import treeDataStore from "../store/treeDataStore";

export const useRecoilTreeData: TreeDataHook = (fn, path) => {
  return useRecoilCallback(({snapshot}) => async () => {
    const tree = await snapshot.getLoadable(treeDataStore.getDescendentData(path))
    const value = await tree.toPromise()
    fn(value)
  })
}