import { NodeConfig, PathSegment } from "@graphter/core";
import React, { ComponentType } from "react";
import { nodeRendererStore } from "@graphter/renderer-react";
import { getValue } from "@graphter/renderer-react";
import { getConfigAt } from "@graphter/renderer-react";
import DynamicCrumb from "./DynamicCrumb";

interface BreadcrumbsProps {
  config: NodeConfig
  globalPath: Array<PathSegment>
  ItemRenderer: ComponentType<ItemRendererProps>
  originalTreeData: any
}

interface ItemRendererProps {
  path: Array<PathSegment>
  children: any
}

interface CrumbData {
  config: NodeConfig | null,
  path: Array<PathSegment>,
  display: {
    path?: Array<PathSegment>,
    label: string
  }
}

const guessingNames = [ 'name', 'title', 'headline', 'label', 'id' ]
const NoMatch = '8024a530-29be-4c9f-b61f-6a4525b18e9a'
const DividerSvg = () => <svg className='w-4 fill-current text-gray-200 mr-2' xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20" fill="currentColor">
  <path fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
        clipRule="evenodd"/>
</svg>

const Breadcrumbs = ({config, globalPath, ItemRenderer, originalTreeData}: BreadcrumbsProps) => {
  const starting = globalPath.slice(0, 1)
  const remaining = globalPath.slice(1)
  const crumbsData = (remaining.reduce<{ current: Array<PathSegment>, crumbsData: Array<CrumbData> }>(
    (a, c) => {
      a.current.push(c)
      const localCurrent = a.current.slice(2)
      const pathConfig = getConfigAt(config, localCurrent, (path: Array<PathSegment>) => getValue(originalTreeData, path))
      if (!pathConfig) throw new Error(`Couldn't find config at ${localCurrent.join('/')}`)
      const display: { path?: Array<PathSegment>, label: string } = {
        label: pathConfig?.name || pathConfig?.id || 'Unknown'
      }
      const renderer = nodeRendererStore.get(pathConfig.type)
      if (renderer.newGetChildPaths) {
        const childPaths = renderer.newGetChildPaths(pathConfig, localCurrent, (path: Array<PathSegment>) => getValue(originalTreeData, path))
        const displayPathSegment = getDisplayPathSegment(childPaths)
        if (displayPathSegment) {
          display.path = [ ...a.current, displayPathSegment ]
        }
      }
      a.crumbsData.push({config: pathConfig, display, path: [ ...a.current ]})
      return a
    }, {current: starting, crumbsData: []})).crumbsData

  return (
    <div>
      {crumbsData.map(crumbData => (
        <ItemRenderer key={crumbData.path.join('/')} path={crumbData.path}>
          {crumbData.display.path ? (
            <DynamicCrumb
              displayPath={crumbData.display.path}
              displayLabel={crumbData.display.label}
            />
          ) : (
            crumbData.display.label
          )}
        </ItemRenderer>
      )
    )}
    </div>
  )
}

function getDisplayPathSegment(paths: Array<Array<PathSegment>>) {
  for (const guessingName of guessingNames) {
    const matchingPath = paths.find(path =>
      path.length &&
      path[path.length - 1].toString().toLowerCase() === guessingName)
    if (matchingPath) return matchingPath[matchingPath.length - 1]
  }
  return null
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