import { NodeConfig, PathSegment } from "microo-core";
import { ArrayNodeDataHook } from "./NodeDataProvider";
import propDataStore from "../store/propDataStore";
import { useRecoilState } from "recoil";
import { nanoid } from "nanoid";
import { useMemo, useState } from "react";
import useRecoilNodeData from "./useRecoilNodeData";

/**
 * TODO: Split out into separate recoil package if successful
 * @param path
 * @param config
 * @param originalNodeData
 * @param committed
 */
export const useRecoilArrayNodeData: ArrayNodeDataHook = (
  path,
  config,
  originalNodeData,
  committed = true,
) => {

  const originalChildIds = useMemo<Array<string>>(() => {
    return originalNodeData.map((item: any, i: number) => {
      return nanoid()
    })
  }, [])

  const [ childIds, setChildIds ] = useRecoilNodeData(path, config, originalChildIds, committed)



  return {
    childIds,
    removeItem: (index: number) => {
      const clone = [...childIds]
      clone.splice(index, 1)
      const childPath = [ ...path, index ]
      propDataStore.remove(childPath)
      setChildIds(clone)
    },
    commitItem: (index: number) => {
      const clone = [...childIds]
      clone.splice(index, 0, nanoid())
      const childPath = [ ...path, index ]
      propDataStore.commitItem(childPath)
      setChildIds(clone)
    }
  }
}

export default useRecoilArrayNodeData