import { NodeConfig, PathSegment } from "@graphter/core";
import React, { ComponentType, Fragment, useEffect, useState } from "react";
import { nodeRendererStore } from "@graphter/renderer-react";
import { pathUtils } from "@graphter/renderer-react";
import { getConfigAt } from "@graphter/renderer-react";
import DynamicCrumb from "./DynamicCrumb";
import { useTreeDataCallback } from "@graphter/renderer-react";

interface BreadcrumbsProps {
  config: NodeConfig
  path: Array<PathSegment>
  AncestorCrumb: ComponentType<AncestorCrumbProps>
  CurrentCrumb: ComponentType<CurrentCrumbProps>
  originalTreeData: any
}

interface AncestorCrumbProps {
  path: Array<PathSegment>
  children: any
}

interface CurrentCrumbProps {
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
const DividerSvg = () => <svg className='inline-block w-4 fill-current text-gray-200 mr-2'
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20" fill="currentColor">
  <path fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
        clipRule="evenodd"/>
</svg>

const Breadcrumbs = ({config, path, AncestorCrumb, CurrentCrumb, originalTreeData}: BreadcrumbsProps) => {
  const starting = path.slice(0, 1)
  const remaining = path.slice(1)
  const [ crumbsData, setCrumbsData ] = useState<Array<CrumbData>>([])
  const initialise = useTreeDataCallback(
    (treeData: any) => {
      (async () => {
        const crumbsData = (await remaining.reduce<Promise<{ current: Array<PathSegment>, crumbsData: Array<CrumbData> }>>(
          async (accPromise, c) => {
            const a = await accPromise
            a.current.push(c)
            const pathConfig = await getConfigAt(config, a.current, (path: Array<PathSegment>) => {
              return pathUtils.getValueByGlobalPath(treeData, path)
            })
            if (!pathConfig) throw new Error(`Couldn't find config at ${a.current.join('/')}`)
            const display: { path?: Array<PathSegment>, label: string } = {
              label: pathConfig?.name || pathConfig?.id || 'Unknown'
            }
            const renderer = nodeRendererStore.get(pathConfig.type)
            if (renderer.newGetChildPaths) {
              const childPaths = await renderer.newGetChildPaths(pathConfig, a.current, (path: Array<PathSegment>) => {
                return pathUtils.getValueByGlobalPath(treeData, path)
              })
              const displayPathSegment = getDisplayPathSegment(childPaths)
              if (displayPathSegment) {
                display.path = [ ...a.current, displayPathSegment ]
              }
            }
            a.crumbsData.push({ config: pathConfig, display, path: [ ...a.current ] })
            return Promise.resolve(a)
          }, Promise.resolve({ current: starting, crumbsData: [] }))).crumbsData
        setCrumbsData(crumbsData)
      })()
    },
    config,
    path.slice(0, 2))

  useEffect(() => {
    initialise()
  }, [ path ])

  return (
    <div>
      {crumbsData.map((crumbData, i) => {
        const key = crumbData.path.join('/')
        const contents = crumbData.display.path ? (
          <DynamicCrumb
            displayPath={crumbData.display.path}
            displayLabel={crumbData.display.label}
          />
        ) : (
          crumbData.display.label
        )
        return (
          <Fragment key={key}>
            {i < crumbsData.length - 1 ? (
              <>
                <AncestorCrumb path={crumbData.path}>
                  {contents}
                </AncestorCrumb>
                <DividerSvg/>
              </>
            ) : (
              <CurrentCrumb key={key}>
                {contents}
              </CurrentCrumb>
            )}
          </Fragment>
        )
      })}
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

export default Breadcrumbs