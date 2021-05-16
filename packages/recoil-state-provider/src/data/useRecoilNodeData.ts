import { useRecoilState } from "recoil";
import { NodeDataHook } from "@graphter/renderer-react";
import { rendererInternalDataStore } from "../store/rendererInternalDataStore";
import { NodeConfig, PathSegment } from "@graphter/core";

export const useRecoilNodeData: NodeDataHook = <D>(path: Array<PathSegment>, config: NodeConfig) => {
  /**
   * Having to use this code indicates init logic isn't working well.
   * Data should be initialised properly before a node ever tries to access it.
   */
    // if(!rendererInternalDataStore.has(path, config)){
    //   const nodeRendererReg = nodeRendererStore.get(config.type)
    //   const defaultInternalData = nodeRendererReg.createFallbackDefaultValue?.(config, path) || null
    //   rendererInternalDataStore.set(path, config, defaultInternalData)
    // }
  const nodeInternalState = rendererInternalDataStore.get<D>(path, config)
  if (!nodeInternalState) throw new Error(`Should have internal data state at '${path.join('/')}' ${config.id}[type=${config.type}] by now`)

  return useRecoilState<D>(nodeInternalState)
}