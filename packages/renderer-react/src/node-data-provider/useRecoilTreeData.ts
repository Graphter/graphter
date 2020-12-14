import { useRecoilCallback } from "recoil";
import treeDataStore from "../store/treeDataStore";
import { TreeDataHook } from "./NodeDataProvider";

export const useRecoilTreeData:TreeDataHook = (fn, path) => {
  return useRecoilCallback(({ snapshot }) => async () => {
    const tree = await snapshot.getPromise(treeDataStore.getDescendentData(path))
    fn(tree)
  })
}