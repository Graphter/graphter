import { PathSegment } from "@graphter/core";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { pathUtils } from "@graphter/renderer-react";
import { useMultipleNodeData } from "@graphter/renderer-react";

interface BreadcrumbProps {
  path: Array<PathSegment>,
  itemRenderer: ({ path, display }: ItemRendererProps) => ReactNode
  originalTreeData: any
}

interface ItemRendererProps {
  path: Array<PathSegment>
  display: string
}

const guessingNames = [ 'name', 'title', 'headline', 'label', 'id' ]
const NoMatch = '8024a530-29be-4c9f-b61f-6a4525b18e9a'

const Breadcrumb = ({ path, originalTreeData }: BreadcrumbProps) => {
  const nodePaths = (path.reduce<{ current: Array<PathSegment>, nodePaths: Array<Array<PathSegment>> }>(
    (a, c) => {
      a.current.push(c)
      a.nodePaths.push([ ...a.current ])
      return a
    }, { current: [], nodePaths: [] })).nodePaths
  const displayPaths = nodePaths.map<Array<PathSegment>>((nodePath: Array<PathSegment>) => {
    const nodeData = pathUtils.getValue(originalTreeData, nodePath, NoMatch)
    if(nodeData === NoMatch) return nodePath
    const nodeDataType = typeof nodeData
    if(nodeDataType === 'string' || nodeDataType === 'number') return nodePath
    if(Array.isArray(nodeData)) throw new Error('I do not know what to do now...')
    const keyMap = new Map<string, string>(Object.entries(nodeData).map(([ key, value]) => [key.toLowerCase(), key]))
    for(const guessingName of guessingNames){
      if(keyMap.has(guessingName)){
        const key = keyMap.get(guessingName)
        if(!key) return nodePath
        return [ ...nodePath, key ]
      }
    }
    return nodePath
  })
  const displayPathsData = useMultipleNodeData(displayPaths)
  if(nodePaths.length !== displayPaths.length || displayPaths.length !== displayPathsData.length) throw new Error('Something has gone wrong')

  return (
    <div className='flex flex-row'>
      {displayPaths.map((displayPath, i) => {
        const key = displayPath.join('/')
        return (
          <Link
            key={key}
            to={pathUtils.toUrl(displayPath.slice(0, -1))}
            className='px-2 py-1 bg-gray-200 hover:bg-gray-300 mr-2 rounded text-gray-600 transition-colours duration-200'
          >
            {displayPathsData[i]}
          </Link>
        )
      })}
      {(path.reduce<{ current: Array<PathSegment>, crumbs: Array<ReactNode> }>(
        (a, c) => {
          const key = a.current.join('/')
          a.current.push(c)
          a.crumbs.push(

          )
          if(a.current.length !== path.length){
            a.crumbs.push(<svg key={`arrow-${key}`} className='w-4 fill-current text-gray-200 mr-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>)
          }
          return a
        }, { current: [], crumbs: [] })).crumbs}
    </div>
  )
}
export default Breadcrumb