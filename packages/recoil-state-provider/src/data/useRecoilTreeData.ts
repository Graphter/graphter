import { useRecoilCallback } from "recoil";
import { TreeDataHook } from "@graphter/renderer-react";
import treeDataStore from "../store/treeDataStore";

export const useRecoilTreeData: TreeDataHook = (fn, path) => {
  return useRecoilCallback(({snapshot}) => async () => {
    const tree = await snapshot.getLoadable(treeDataStore.getDescendentData(path))
    if(tree.state === 'hasValue') fn(tree.contents)
  })
}