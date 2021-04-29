import { RecoilValueReadOnly, selector } from "recoil";
import { NodeConfig, PathSegment } from "@graphter/core";
import { propDataStore } from "./propDataStore";
import { PathMeta } from "@graphter/renderer-react";
import { PathMetaNode } from "@graphter/renderer-react";

const treeDataMap: { [key: string]: RecoilValueReadOnly<any> } = {};
const descendentPathMetaMap: { [key: string]: RecoilValueReadOnly<Array<PathMeta>> } = {};

const treeKeySalt = 'c2c87429-dabf-4ea0-b2e1-6e7a6262bc11'
const descendentPathKeySalt = '04ea4750-019b-446d-87f4-c025f837ab7f'
const pathToKey = (path: Array<PathSegment>) => path.join('[88484d0d-33e8-47b4-a351-7bb581268da3]')

export interface TreeDataStore {
  getBranchData: (startingConfig: NodeConfig, startingPath: Array<PathSegment>, depth?: number) => RecoilValueReadOnly<any>
  getBranchMetas: (startingConfig: NodeConfig, startingPath: Array<PathSegment>) => RecoilValueReadOnly<Array<PathMeta>>
}

const treeDataStore: TreeDataStore = {
  getBranchData: (startingConfig, startingPath, depth) => {
    if (!startingConfig) throw new Error('Config is required to get descendent data')
    if (!startingPath) throw new Error('Path is required to get descendent data')
    const key = `tree-from-${startingPath.join(treeKeySalt)}`
    let treeDataSelector = treeDataMap[key]
    if (treeDataSelector) return treeDataSelector

    treeDataMap[key] = treeDataSelector = selector<any>({
      key: key,
      get: async ({get}) => {
        const processedKeyMap = new Map<string, boolean>()

        async function getPathData(path: Array<PathSegment>): Promise<any> {
          const state = propDataStore.get(path)
          if (!state) throw new Error(`Missing state for ${path.join('/')}'`)
          const pathMeta = get<PathMeta>(state)


          // Detect infinite loops
          const pathKey = pathToKey(pathMeta.path)
          if (processedKeyMap.has(pathKey)) {
            throw new Error(`Path '${pathMeta.path.join('/')}' has already been processed. Possible infinite loop.`)
          } else processedKeyMap.set(pathKey, true)

          // merge
          if (process.env.NODE_ENV === 'development') {
            if (pathMeta.nodes.filter(node => node.rendererRegistration.mergeChildData).length > 1) {
              throw new Error('Only one path node can have a merger function. All the others must be transparent.')
            }
          }
          const pathMergerNode = pathMeta.nodes.find(node => node.rendererRegistration.mergeChildData)
          if(!pathMeta.childPaths){
            return getFirstEligibleNodeData(pathMeta.nodes)
          }
          const childData = await Promise.all(pathMeta.childPaths.map(childPath => getPathData(childPath)))
          if(!childData?.length){
            return getFirstEligibleNodeData(pathMeta.nodes)
          }
          if (!pathMergerNode?.rendererRegistration?.mergeChildData) {
            throw new Error(`Path '${pathMeta.path.join('/')}' has children but is missing a node to merge the children together`)
          }
          return pathMergerNode?.rendererRegistration?.mergeChildData(
            pathMergerNode.config,
            pathMeta.path,
            pathMergerNode.internalData,
            (path: Array<PathSegment>) => {
              const state = propDataStore.get(path)
              if (!state) throw new Error(`Couldn't find state for path '${path.join('/')}'`)
              const pathMeta = get(state)
              return pathMeta.nodes.map(node => {
                return node.rendererRegistration.transformOut ?
                  node.rendererRegistration.transformOut(node.internalData) :
                  node.internalData
              })
            },
            childData)

          // TODO: transform out
        }

        return await getPathData(startingPath)
      }
    });

    return treeDataSelector
  },

  getBranchMetas: (startingConfig, startingPath): RecoilValueReadOnly<Array<PathMeta>> => {
    if (!startingConfig) throw new Error('Config is required to get descendent data')
    if (!startingPath) throw new Error('Path is required to get descendent data')
    const key = `descendent-paths-${startingPath.join(descendentPathKeySalt)}`
    let descendentPathMetaSelector = descendentPathMetaMap[key]
    if (descendentPathMetaSelector) return descendentPathMetaSelector
    descendentPathMetaMap[key] = descendentPathMetaSelector = selector<Array<PathMeta>>({
      key: key,
      get: ({get}) => {
        function getChildMetas(path: Array<PathSegment>): Array<PathMeta> {
          const state = propDataStore.get(path)
          if (!state) throw new Error(`Missing state for ${path.join('/')}'`)
          const pathMeta = get(state)
          return [
            pathMeta,
            ...pathMeta.childPaths.map(getChildMetas).flat()
          ]
        }

        return getChildMetas(startingPath)
      }
    })
    return descendentPathMetaSelector
  }

}

export default treeDataStore

function getFirstEligibleNodeData(nodes: Array<PathMetaNode>): { config: NodeConfig, data: any; } | undefined{
  const eligibleNode = nodes.find(node => typeof node.internalData !== undefined)
  return eligibleNode ? {
    config: eligibleNode.config,
    data: eligibleNode.internalData
  } : undefined
}