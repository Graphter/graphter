import { useRecoilCallback } from "recoil";
import { TreeDataCallbackHook } from "@graphter/renderer-react";
import branchDataStore from "../store/branchDataStore";

export const useRecoilTreeDataCallback: TreeDataCallbackHook = (fn, path, depth) => {

  const cb = useRecoilCallback(({snapshot}) => async (...args: any) => {
    fn(await snapshot.getPromise(branchDataStore.get(path, depth)), ...args)
  }, [ path ])

  return cb
}