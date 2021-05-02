import { useRecoilState } from "recoil";
import { NodeDataHook } from "@graphter/renderer-react";
import { rendererInternalDataStore } from "../store/rendererInternalDataStore";
import { NodeConfig, PathSegment } from "@graphter/core";

/**
 * @param path
 */
export const useRecoilNodeData: NodeDataHook = <D>(path: Array<PathSegment>, config: NodeConfig) => {

  const nodeInternalData = rendererInternalDataStore.get<D>(path, config)
  if(!nodeInternalData) throw new Error('Should have internal data state by now')

  return useRecoilState<D>(nodeInternalData)
}