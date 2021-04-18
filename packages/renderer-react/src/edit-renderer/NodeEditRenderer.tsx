/***
 * This module needs to be broken up and much of it moved out of the package
 */
import React, { ComponentType, ReactNode, Suspense, useEffect, useState } from "react";
import DefaultError from "../default-error";
import {
  ErrorRendererProps, NodeConfig,
  PathSegment,
} from "@graphter/core"
import nodeRendererStore from "../store/nodeRendererStore"
import ValidationSummary from "./ValidationSummary";
import { useConfig } from "../providers/config";
import { useTreeDataCallback } from "../providers/state";
import { getConfigAt, getConfigsTo } from "../util/node";
import { pathUtils } from "../util/path";
import { useTreeDataSnapshot } from "../hooks/data";

export interface NodeEditRendererProps {
  path: Array<PathSegment>
  errorRenderer?: ComponentType<ErrorRendererProps>
  onSaved?: (modelId: string, instance: any) => void
  cancel: (modelId: string | undefined, instance: any) => void
  startingData: any
}

export default function NodeEditRenderer(
  {
    path,
    errorRenderer,
    cancel,
    startingData
  }: NodeEditRendererProps) {

  const ErrorDisplayComponent: ComponentType<ErrorRendererProps> = errorRenderer || DefaultError

  const [ loadedTreeState, setLoadedTreeState ] = useState<
    {
      childPath: Array<PathSegment>,
      childConfig: NodeConfig | null,
      configs: Array<NodeConfig> | null
    }
  >({
    childPath: path,
    childConfig: null,
    configs: null
  })


  const topNodeConfigId = loadedTreeState.childPath[0]
  const editingId = loadedTreeState.childPath[1]
  const topNodePath = loadedTreeState.childPath.slice(0, 2)

  const topNodeConfig = useConfig(topNodeConfigId)

  const save = useTreeDataCallback(
    (treeData) => {
      console.log('saving model ', treeData)
    },
    topNodeConfig,
    path)

  const treeData = useTreeDataSnapshot(topNodeConfig, path)

  const initialise = useTreeDataCallback(
    (treeData: any) => {
      (async () => {
        const configs = await getConfigsTo(topNodeConfig, path, (path) => {
          console.log(treeData)
          return pathUtils.getValueByGlobalPath(treeData, path)
        })
        if(!configs?.length) throw new Error(`Couldn't find config at ${path.join('/')}`)
        const childConfig = configs[configs.length - 1]

        setLoadedTreeState({
          childPath: path,
          configs,
          childConfig
        })
      })()
    },
    topNodeConfig,
    path.slice(0, 2))

  useEffect(() => {
    initialise()
  }, [ topNodeConfig, path, treeData ])

  if(!startingData || !loadedTreeState.childConfig || !loadedTreeState.configs) return null

  const childRegistration = nodeRendererStore.get(loadedTreeState.childConfig.type)
  if(!childRegistration) throw new Error(`No child renderer found for type '${loadedTreeState.childConfig.type}'`)
  const TypeRenderer = childRegistration.Renderer

  return (
    <div className='' data-testid='node-edit-renderer' >

      <form onSubmit={e => {
        e.preventDefault();
        (async () => {
          await save()
        })()
      }} data-testid='form'>
        <div className='mt-8 mb-10'>
          <h1 className='text-2xl'>{loadedTreeState.childConfig.name}</h1>
          {loadedTreeState.childConfig.description && <p className='text-sm text-gray-500'>{loadedTreeState.childConfig.description}</p>}
        </div>

        <Suspense fallback={<div>Loading validation...</div>}>
        <TypeRenderer
          path={loadedTreeState.childPath}
          config={loadedTreeState.childConfig}
          configAncestry={loadedTreeState.configs}
          originalTreeData={startingData}
          options={childRegistration.options}
          ErrorDisplayComponent={ErrorDisplayComponent}
        />
        </Suspense>
        <div className='border-t pt-10'>

          {/*<Suspense fallback={<div>Loading validation...</div>}>
            <ValidationSummary config={topNodeConfig} path={topNodePath} />
          </Suspense>*/}

          <div className='flex justify-between'>
            <button type='submit' data-testid='save' className='flex-grow p-3 mr-2 bg-green-500 text-white rounded'>Save</button>
            <button type='button' data-testid='cancel' className='p-3 mr-2 bg-red-500 text-white rounded'
                    onClick={() => cancel(topNodeConfig.id, editingId)}>Cancel
            </button>
          </div>

        </div>
      </form>
    </div>
  );

}


