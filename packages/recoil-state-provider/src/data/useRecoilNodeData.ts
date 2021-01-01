import { useRecoilState } from "recoil";
import { propDataStore } from "../store/propDataStore";
import { NodeDataHook } from "@graphter/renderer-react";

/**
 * TODO: Split out into separate recoil package if successful
 * @param path
 * @param originalNodeData
 * @param committed
 */
export const useRecoilNodeData: NodeDataHook = (
  path,
  originalNodeData,
  committed = true,
  ) => {

  let propDataState;
  if(!propDataStore.has(path)){
    propDataStore.set(path, committed, originalNodeData)
  }
  propDataState = propDataStore.get(path)

  return useRecoilState(propDataState)
}