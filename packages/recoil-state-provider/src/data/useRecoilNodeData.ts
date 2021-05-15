import { useRecoilState } from "recoil";
import { NodeDataHook } from "@graphter/renderer-react";
import { rendererInternalDataStore } from "../store/rendererInternalDataStore";
import { NodeConfig, PathSegment } from "@graphter/core";

/**
 * @param path
 */
export const useRecoilNodeData: NodeDataHook = <D>(path: Array<PathSegment>, config: NodeConfig) => {

  const nodeInternalState = rendererInternalDataStore.get<D>(path, config)
  if(!nodeInternalState) throw new Error(`Should have internal data state at '${path.join('/')}' ${config.id}[type=${config.type}] by now`)

  return useRecoilState<D>(nodeInternalState)
}