import { propDataStore } from "../store/propDataStore";
import { TreeDataInitialiserHook } from "@graphter/renderer-react";
import { getTreeMeta } from "@graphter/renderer-react";
import { PathSegment } from "@graphter/core";
import { pathUtils } from "@graphter/renderer-react"
import { createDefault, nodeRendererStore } from "@graphter/renderer-react";
import validationDataStore from "../store/validationDataStore";

const NO_MATCH = 'no-match-ac437190-4001-4fe3-bf1f-8ad03366d1dd'

export const useRecoilTreeDataInitialiser: TreeDataInitialiserHook = () => {
  return async (config, path, originalTreeData) => {

    const getNodeValue = (path: Array<PathSegment>) => {
      const result = pathUtils.getValueByGlobalPath(originalTreeData, path, NO_MATCH)
      if (result === NO_MATCH) return
      return result
    }

    const treeMeta = await getTreeMeta(config, path, getNodeValue)

    for (const nodeMeta of treeMeta) {
      if (!nodeMeta.path.length) continue
      if (propDataStore.has(nodeMeta.path)) continue
      const rendererReg = nodeRendererStore.get(nodeMeta.config.type)
      if(rendererReg.initialiser){
        const initialData = await rendererReg.initialiser(originalTreeData, nodeMeta.config, nodeMeta.path)
        propDataStore.set(nodeMeta.path, initialData)
        // TODO: Should do initial validation here
        validationDataStore.set(nodeMeta.path, initialData, [])
      } else {
        let initialData = pathUtils.getValueByGlobalPath(originalTreeData, nodeMeta.path, NO_MATCH)
        if (initialData === NO_MATCH) {
          initialData = createDefault(
            nodeMeta.config,
            rendererReg.createFallbackDefaultValue ?
              await rendererReg.createFallbackDefaultValue(nodeMeta.config, nodeMeta.path, getNodeValue) :
              null
          )
        }
        propDataStore.set(nodeMeta.path, initialData)
        // TODO: Should do initial validation here
        validationDataStore.set(nodeMeta.path, initialData, [])
      }
    }
  }
}