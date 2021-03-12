import { nanoid } from "nanoid";
import { useRecoilNodeData } from "./useRecoilNodeData";
import { propDataStore } from "../store/propDataStore";
import { ArrayNodeDataHook } from "@graphter/renderer-react";
import { useState } from "react";

/**
 * @param path
 */
export const useRecoilArrayNodeData: ArrayNodeDataHook = (
  path,
) => {

  const [ arrayItems ] = useRecoilNodeData(path)

  const [ childIds, setChildIds ] = useState(arrayItems.map(() => nanoid()))

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