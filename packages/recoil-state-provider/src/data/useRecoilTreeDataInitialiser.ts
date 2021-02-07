import { propDataStore } from "../store/propDataStore";
import { TreeDataInitialiserHook } from "@graphter/renderer-react";

export const useRecoilTreeDataInitialiser: TreeDataInitialiserHook = () => {
  return (path, originalTreeData) => {
    if(typeof originalTreeData === 'undefined') return
    propDataStore.init(path, originalTreeData)
  }
}