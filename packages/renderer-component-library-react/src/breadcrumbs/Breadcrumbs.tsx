import { NodeConfig, PathSegment } from "@graphter/core";
import React, { ComponentType, ReactNode } from "react";
import { pathUtils } from "@graphter/renderer-react";
import { useMultipleNodeData } from "@graphter/renderer-react";
import { nodeRendererStore } from "@graphter/renderer-react";

interface BreadcrumbProps {
  config: NodeConfig
  globalPath: Array<PathSegment>
  ItemRenderer: ComponentType<ItemRendererProps>
  originalTreeData: any
}

interface ItemRendererProps {
  path: Array<PathSegment>
  children: any
}

const guessingNames = [ 'name', 'title', 'headline', 'label', 'id' ]
const NoMatch = '8024a530-29be-4c9f-b61f-6a4525b18e9a'
const DividerSvg = () => <svg className='w-4 fill-current text-gray-200 mr-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
</svg>

const Breadcrumbs = ({ config, globalPath, ItemRenderer, originalTreeData }: BreadcrumbProps) => {
  const localPath = globalPath.slice(2)
  const registration = nodeRendererStore.get(config.type)
  if(!registration) throw new Error(`No renderer found for type '${config.type}'`)
  const configs = registration.getChildConfig ?
    registration.getChildConfig(config, [ ], [ ...localPath ], originalTreeData) :
    [ config ]
  return <div>
    Breadcrumbs!
  </div>
}

// const Breadcrumbs_old = ({ config, globalPath, ItemRenderer, originalTreeData }: BreadcrumbProps) => {
//   const localPath = globalPath.slice(2)
//   const registration = nodeRendererStore.get(config.type)
//   if(!registration) throw new Error(`No renderer found for type '${config.type}'`)
//   const configs = registration.getChildConfig ?
//     registration.getChildConfig([ config ], localPath, localPath, originalTreeData) :
//     [ config ]
//   const starting = globalPath.slice(0, 1)
//   const remaining = globalPath.slice(1)
//
//   const nodePaths = (remaining.reduce<{ current: Array<PathSegment>, nodePaths: Array<Array<PathSegment>> }>(
//     (a, c) => {
//       a.current.push(c)
//       a.nodePaths.push([ ...a.current ])
//       return a
//     }, { current: starting, nodePaths: [] })).nodePaths
//
//   const displayPaths = nodePaths.map<Array<PathSegment>>((nodePath: Array<PathSegment>) => {
//     const localPath = nodePath.slice(2)
//     const nodeData = pathUtils.getValue(originalTreeData, localPath, NoMatch)
//     if(nodeData === NoMatch) return nodePath
//     const nodeDataType = typeof nodeData
//     if(nodeDataType === 'string' || nodeDataType === 'number') return nodePath
//     if(Array.isArray(nodeData)) return nodePath
//     const keyMap = new Map<string, string>(Object.entries(nodeData).map(([ key, value]) => [key.toLowerCase(), key]))
//     for(const guessingName of guessingNames){
//       if(keyMap.has(guessingName)){
//         const key = keyMap.get(guessingName)
//         if(!key) return nodePath
//         return [ ...nodePath, key ]
//       }
//     }
//     return nodePath
//   })
//
//   const displayPathsDataResult = useMultipleNodeData(displayPaths)
//   if(nodePaths.length !== displayPaths.length || displayPaths.length !== displayPathsDataResult.length) throw new Error('Something has gone wrong')
//   const displayPathsData = displayPathsDataResult
//     .map((nodeData, i) => {
//       if(Array.isArray(nodeData.data)){
//         const arrayConfig = configs[i]
//         return arrayConfig.name || arrayConfig.id
//       }
//       if(typeof nodeData.data === 'object') return 'Empty'
//       return nodeData.data
//     })
//
//   return (
//     <div className='flex flex-row'>
//       <ItemRenderer path={[ config.id ]}>{config.name}</ItemRenderer>
//       <DividerSvg />
//       {displayPaths.map((displayPath, i) => {
//         const key = displayPath.join('/')
//         return <>
//           <ItemRenderer key={key} path={nodePaths[i]}>{displayPathsData[i]}</ItemRenderer>
//           {i !== displayPaths.length - 1 && (
//             <DividerSvg key={`arrow-${key}`} />
//           )}
//         </>
//       })}
//     </div>
//   )
// }
export default Breadcrumbs