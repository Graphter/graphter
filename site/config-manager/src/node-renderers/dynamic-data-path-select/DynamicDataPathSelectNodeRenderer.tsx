/**
 * This is a good candidate for promotion to a core package. Still some questions to answer:
 * - ~~Should the data accessed by this renderer also be defined by a configuration?~~
 * - Can we do better with options typing? Does it have to be type 'any' or can we get some compile-time safety?
 *
 * Summary: wait until more battle tested before promotion
 */
import React, { ComponentType, useEffect, useState } from "react";
import { NodeRendererProps, PathSegment, Service } from "@graphter/core";
import { useNodeData } from "@graphter/renderer-react";
import { pathUtils } from "@graphter/renderer-react";
import { setupNodeRenderer } from "@graphter/renderer-react";
import { serviceStore } from "@graphter/renderer-react";
import { isDynamicDataPathSelectNodeConfig } from "./isDynamicDataPathSelectNodeConfig";
import Path from "./Path";
import { useTreeData } from "@graphter/renderer-react";

const pathKeySalt = '46662294-54c3-4b4b-85e9-383d6a07274b'


interface PathMeta {
  key: string
  path: Array<PathSegment>
  count: number
}

const DynamicDataPathSelectNodeRenderer: ComponentType<NodeRendererProps> = setupNodeRenderer((
  {
    config,
    path,
    originalTreeData
  }: NodeRendererProps
) => {
  if (!isDynamicDataPathSelectNodeConfig(config)) throw new Error('Invalid DynamicDataPathSelectNodeRenderer config')
  const [ touched, setTouched ] = useState(false)
  const [ nodeData, setNodeData ] = useNodeData<Array<PathSegment>>(path, config, originalTreeData)
  const serviceIdPaths = pathUtils.resolvePaths(path, config.options.serviceIdPathQuery, nodeData)
  if (serviceIdPaths.length === 0) throw new Error(`Service ID path query ${pathUtils.queryPathToString(config.options.serviceIdPathQuery)}' did not resolve to a node in the tree`)
  if (serviceIdPaths.length > 1) throw new Error(`Service ID path query ${pathUtils.queryPathToString(config.options.serviceIdPathQuery)}' resolved to more than one node in the tree`)

  const serviceId = useTreeData<string>(serviceIdPaths[0])
  const [ pathMetas, setPathMetas ] = useState<Array<PathMeta> | null>(null)
  const [ dataService, setDataService ] = useState<Service | null>(null)
  const [ loading, setLoading ] = useState(true)
  const [ showChoice, setShowChoice ] = useState(!nodeData)

  useEffect(() => {
    (async () => {
      if (!serviceStore.has(serviceId)) return
      const dataService = serviceStore.get(serviceId)
      setDataService(dataService)
      const serviceDataSample = (await dataService.list())
      if (!serviceDataSample.items.length) return
      const pathsMetaMap = serviceDataSample.items.reduce<Map<string, PathMeta>>((a, c) => {
        const paths = pathUtils.valueToLocalPaths(c)
        paths.forEach(path => {
          const pathKey = path.join(pathKeySalt)
          const meta = a.get(pathKey)
          if (meta) {
            meta.count++
          } else a.set(pathKey, {
            key: pathKey,
            path,
            count: 1
          })
        })
        return a
      }, new Map<string, PathMeta>())
      const pathsMeta = Array.from(pathsMetaMap.values())
      setPathMetas(pathsMeta)
      if(pathsMeta.length === 1){
        setNodeData(pathsMeta[0].path)
      }
      setLoading(false)
    })()
  }, [ serviceId ])

  if (!dataService) {
    if (serviceId) {
      return (
        <div className='flex-grow'>No service with ID '{serviceId}' has been registered</div>
      )
    } else {
      return (
        <div className='flex-grow bg-blue-100 text-blue-400 p-3 rounded'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 inline" fill="none" viewBox="0 0 24 24"
               stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Select a service first</div>
      )
    }
  }

  return (
    <>
      <div
        className='flex-grow'
      >
        {loading && (
          <div>Loading...</div>
        )}

        {!showChoice && nodeData && (
          <Path
            path={nodeData}
            selected={true}
            onClick={() => {
              setShowChoice(true)
            }} />
        )}

        {showChoice && (
          <div>
            {pathMetas && pathMetas.map(pathMeta => (
              <Path
                key={pathMeta.key}
                path={pathMeta.path}
                selected={nodeData && pathMeta.key === nodeData.join(pathKeySalt)}
                onClick={pathMetas.length === 1 ? null : () => {
                  setNodeData(pathMeta.path)
                  setShowChoice(false)
                }}
              />
            ))}
            {pathMetas && pathMetas.length === 1 && (
              <div className='border rounded border-blue-100 p-1 bg-blue-50 text-blue-400'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                There's only one path to choose from
              </div>
            )}
          </div>
        )}

      </div>
    </>
  )
})

export default DynamicDataPathSelectNodeRenderer