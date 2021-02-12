import { propDataStore } from "../store/propDataStore";
import { TreeDataInitialiserHook } from "@graphter/renderer-react";
import { nodeRendererStore } from "@graphter/renderer-react";

export const useRecoilTreeDataInitialiser: TreeDataInitialiserHook = () => {
  return (config, path, originalTreeData) => {
    const rendererRegistration = nodeRendererStore.get(config.type)
    if(!rendererRegistration) throw new Error(`Unable to find renderer for node type '${config.type}' at ${path.join('/')}`)
    if(rendererRegistration.initialiseData){
      rendererRegistration.initialiseData(config, path, originalTreeData, (path, originalData) => {
        if(!propDataStore.has(path)) {
          propDataStore.set(path, true, originalData)
        }
      })
    } else {
      if(!propDataStore.has(path)) {
        propDataStore.set(path, true, originalTreeData)
      }
    }
  }
}