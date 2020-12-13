import { useRecoilCallback } from "recoil";
import modelDataStore from "../store/modelDataStore";
import { PathSegment } from "@graphter/core";
import { TreeDataHook } from "./NodeDataProvider";

export const useRecoilTreeData:TreeDataHook = (fn: (data: any) => void, path: Array<PathSegment>) => {
  return useRecoilCallback(({ snapshot }) => async () => {
    const tree = await snapshot.getPromise(modelDataStore.get(path))
    fn(tree)
  })
}