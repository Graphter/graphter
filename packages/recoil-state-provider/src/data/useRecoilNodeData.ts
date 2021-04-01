import { useRecoilState } from "recoil";
import { propDataStore } from "../store/propDataStore";
import { NodeDataHook } from "@graphter/renderer-react";

/**
 * @param path
 */
export const useRecoilNodeData: NodeDataHook = (
  path
  ) => {

  let propDataState;

  propDataState = propDataStore.get(path)

  return useRecoilState(propDataState)
}