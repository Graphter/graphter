import { useRecoilValue } from "recoil";
import { MultipleNodeDataHook } from "@graphter/renderer-react";
import multiplePropDataStore from "../store/multiplePropDataStore";

/**
 * @param paths
 */
export const useRecoilMultipleNodeData: MultipleNodeDataHook = (paths) => {

  let propDataState;

  propDataState = multiplePropDataStore.get(paths)

  return useRecoilValue(propDataState)
}