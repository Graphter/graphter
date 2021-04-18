import { useRecoilCallback } from "recoil";
import treeDataStore from "../store/treeDataStore";
import { TreeDataCallbackHook } from "@graphter/renderer-react";

export const useRecoilTreeDataCallback: TreeDataCallbackHook = (fn, config, path, depth) => {
  return useRecoilCallback(({snapshot}) => async () => {
    fn(await snapshot.getPromise(treeDataStore.getBranchData(config, path, depth)))
  }, [ config, path ])
}