import { propDataStore } from "../store/propDataStore";
import { TreeDataInitialiserHook } from "@graphter/renderer-react";
import { nodeRendererStore } from "@graphter/renderer-react";

export const useRecoilTreeDataInitialiser: TreeDataInitialiserHook = () => {
  return (config, path, committed = true, originalTreeData) => {
    const rendererRegistration = nodeRendererStore.get(config.type)
    if(!rendererRegistration) throw new Error(`Unable to find renderer for node type '${config.type}' at ${path.join('/')}`)
    if(rendererRegistration.initialiseData){
      rendererRegistration.initialiseData(
        config,
        path,
        (path, originalData) => {
          if(!propDataStore.has(path)) {
            propDataStore.set(path, committed, originalData)
          }
        },
        originalTreeData)
    } else {
      if(!propDataStore.has(path)) {
        propDataStore.set(path, committed, originalTreeData)
      }
    }
  }
}