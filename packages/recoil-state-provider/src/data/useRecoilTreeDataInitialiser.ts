import { propDataStore } from "../store/propDataStore";
import { TreeDataInitialiserHook } from "@graphter/renderer-react";
import { getTreeMeta } from "@graphter/renderer-react";
import { PathSegment } from "@graphter/core";
import { getValue } from "@graphter/renderer-react"
import { createDefault, nodeRendererStore } from "@graphter/renderer-react";

const NO_MATCH = 'no-match-ac437190-4001-4fe3-bf1f-8ad03366d1dd'

export const useRecoilTreeDataInitialiser: TreeDataInitialiserHook = () => {
  return (config, path, committed = true, originalTreeData) => {

    const getNodeValue = (path: Array<PathSegment>) => {
      const result = getValue(originalTreeData, path, NO_MATCH)
      if (result === NO_MATCH) return
      return result
    }

    const localPath = path.slice(2)
    const treeMeta = getTreeMeta(config, localPath, getNodeValue)

    for (const nodeMeta of treeMeta) {
      if (!nodeMeta.path.length) continue
      const globalPath = [ ...path.slice(0, 2), ...nodeMeta.path ]
      if (propDataStore.has(globalPath)) continue
      const rendererReg = nodeRendererStore.get(nodeMeta.config.type)
      if(rendererReg.initialiser){
        const initialData = rendererReg.initialiser(originalTreeData, nodeMeta.config, nodeMeta.path)
        propDataStore.set(globalPath, initialData)
      } else {
        let initialData = getValue(originalTreeData, nodeMeta.path, NO_MATCH)
        if (initialData === NO_MATCH) {
          initialData = createDefault(
            nodeMeta.config,
            rendererReg.createFallbackDefaultValue ?
              rendererReg.createFallbackDefaultValue(nodeMeta.config, globalPath, getNodeValue) :
              null
          )
        }
        propDataStore.set(globalPath, initialData)
      }



    }

  }

}