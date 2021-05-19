import { useRecoilState, useRecoilValue } from "recoil";
import { NodeDataHook } from "@graphter/renderer-react";
import { rendererInternalDataStore } from "../store/rendererInternalDataStore";
import { NodeConfig, PathSegment } from "@graphter/core";
import { pathConfigsStore } from "../store/pathConfigsStore";
import { getExactPathConfigs } from "../utils/getExactPathConfigs";
import { pathConfigsToString } from "../utils/pathConfigsToString";

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
  const pathConfigsState = pathConfigsStore.get(path)
  const allPathConfigs = useRecoilValue(pathConfigsState)
  const exactPathConfigs = getExactPathConfigs(allPathConfigs, config)
  const nodeInternalState = rendererInternalDataStore.get<D>(path, exactPathConfigs)
  if (!nodeInternalState) throw new Error(`Should have internal data state at '${pathConfigsToString(exactPathConfigs)}' ${config.id}[type=${config.type}] by now`)

  return useRecoilState<D>(nodeInternalState)
}