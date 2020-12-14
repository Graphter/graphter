import { useRecoilCallback } from "recoil";
import modelDataStore from "../store/modelDataStore";
import { TreeDataHook } from "./NodeDataProvider";

export const useRecoilTreeData:TreeDataHook = (fn, path) => {
  return useRecoilCallback(({ snapshot }) => async () => {
    const tree = await snapshot.getPromise(modelDataStore.get(path))
    fn(tree)
  })
}