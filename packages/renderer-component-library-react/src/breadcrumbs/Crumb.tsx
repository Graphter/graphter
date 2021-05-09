import { PathSegment } from "@graphter/core";
import React, { Suspense } from "react";
import { useChildPaths } from "@graphter/renderer-react";
import { useNodeConfigs, useTreeData } from "@graphter/renderer-react";

export interface CrumbProps {
  path: Array<PathSegment>
}

const guessingNames = [ 'name', 'title', 'headline', 'label', 'id' ]

const Crumb = ({ path }: CrumbProps) => {
  const [ childPaths ] = useChildPaths(path)
  const displayPath = guessDisplayPath(childPaths)
  return displayPath ? (
    <Suspense fallback={'...'}><DynamicCrumb path={path} displayPath={displayPath} /></Suspense>
  ) : (
    <StaticCrumb path={path} />
  )
}

interface DynamicCrumbProps {
  path: Array<PathSegment>,
  displayPath: Array<PathSegment>
}
export const DynamicCrumb = ({ displayPath, path }: DynamicCrumbProps) => {
  const displayValue = useTreeData(displayPath)
  const displayValueType = typeof displayValue
  if(displayValueType === 'string' || displayValueType === 'number'){
    if(displayValue === '') return <span className='text-gray-400'>Unnamed</span>
    else return displayValue
  } else return <StaticCrumb path={path} />
}

interface StaticCrumbProps {
  path: Array<PathSegment>,
}

export const StaticCrumb = ({ path }: StaticCrumbProps) => {
  const configs = useNodeConfigs(path)
  return <>{configs[0].name}</>
}

function guessDisplayPath(paths: Array<Array<PathSegment>>) {
  const searchMeta = paths.map(path => {
    const lastSegment = path[path.length - 1]
    return {
      path: path,
      loweredSegment: lastSegment.toString().toLowerCase()
    }
  })

  for (const guessingName of guessingNames) {
    const exact = searchMeta.find(searchMeta => {
      return searchMeta.loweredSegment === guessingName ||
        searchMeta.loweredSegment.includes(guessingName)
    })
    if(exact) return exact.path
  }
  return null
}

export default Crumb