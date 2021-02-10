import { useRecoilCallback } from "recoil";
import treeDataStore from "../store/treeDataStore";
import { TreeDataCallbackHook } from "@graphter/renderer-react";

export const useRecoilTreeDataCallback: TreeDataCallbackHook = (fn, config, path) => {
  return useRecoilCallback(({snapshot}) => async () => {
    fn(await snapshot.getPromise(treeDataStore.getDescendentData(config, path)))
  })
}