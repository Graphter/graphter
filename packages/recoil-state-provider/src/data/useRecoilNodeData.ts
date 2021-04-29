import { useRecoilState } from "recoil";
import { propDataStore } from "../store/propDataStore";
import { NodeDataHook } from "@graphter/renderer-react";
import { nodeRendererStore } from "@graphter/renderer-react";
import { getValueByGlobalPath } from "@graphter/renderer-react";
import { useEffect } from "react";
import { PathMeta } from "@graphter/renderer-react";

/**
 * @param path
 */
export const useRecoilNodeData: NodeDataHook = (
  path,
  config,
  originalTreeData
  ) => {

  let parentMeta: PathMeta | null = null
  let parentSetMeta: ((meta: PathMeta) => void) | null = null

  if(path.length > 2){
    // We can do this conditional because path is expected to be stable for this instance of the hook
    const parentState = propDataStore.get(path.slice(0, -1))
    if(!parentState) throw new Error('Parent state is expected to always have been stored before a child is processed')
    const parent = useRecoilState(parentState)
    parentMeta = parent[0]
    parentSetMeta = parent[1]
  }

  if(!propDataStore.has(path)){
    // Store meta for current path

    propDataStore.set(generatePathMeta())

    if(path.length > 2 && parentMeta && parentSetMeta){
      // Add path to parent
      parentMeta = {
        ...parentMeta,
        childPaths: [
          ...parentMeta.childPaths,
          path
        ]
      }
      parentSetMeta(parentMeta)
    }
  }

  const propDataState = propDataStore.get(path)
  if(!propDataState) throw new Error('Should have state by now')

  const [ pathMeta, setPathMeta ] = useRecoilState(propDataState)

  useEffect(() => {
    if(!pathMeta.nodes.length){
      // Looks like the path meta hasn't been initialised yet - could happen if another node has requested it before it's nodes have rendered
      setPathMeta(generatePathMeta())
    }
  })

  return [ pathMeta.nodes.find(node => node.config.id === config.id)?.internalData, (newData: any) => {
    setPathMeta({
      ...pathMeta,
      nodes: pathMeta.nodes.map(node => {
        return node.config.id === config.id ?
          {
            ...node,
            internalData: newData
          } :
          node
      })
    })
  } ]

  function generatePathMeta(): PathMeta {
    const rendererRegistration = nodeRendererStore.get(config.type)
    const fallbackValue = rendererRegistration.createFallbackDefaultValue ?
      rendererRegistration.createFallbackDefaultValue(config, path, (path) => getValueByGlobalPath(originalTreeData, path)) :
      null
    return {
      path,
      nodes: [
        {
          config,
          internalData: rendererRegistration.initialiser ?
            rendererRegistration.initialiser(originalTreeData, config, path) :
            getValueByGlobalPath(originalTreeData, path, fallbackValue),
          rendererRegistration
        }
      ],
      childPaths: []
    }
  }
}
