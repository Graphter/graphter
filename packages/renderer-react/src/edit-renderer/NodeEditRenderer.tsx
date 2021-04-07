/***
 * This module needs to be broken up and much of it moved out of the package
 */
import React, { ComponentType, ReactNode, useEffect, useState } from "react";
import DefaultError from "../default-error";
import {
  ErrorRendererProps, NodeConfig,
  PathSegment,
} from "@graphter/core"
import nodeRendererStore from "../store/nodeRendererStore"
import ValidationSummary from "./ValidationSummary";
import { useConfig } from "../providers/config";
import { useTreeDataCallback } from "../providers/state";
import { getConfigAt } from "../util/node";
import { getValue } from "../util/path";

export interface NodeEditRendererProps {
  path: Array<PathSegment>
  errorRenderer?: ComponentType<ErrorRendererProps>
  onSaved?: (modelId: string, instance: any) => void
  cancel: (modelId: string | undefined, instance: any) => void
  startingData: any
}

class Suspense extends React.Component<{ fallback: JSX.Element, children: ReactNode }> {
  render() {
    return null;
  }
}

export default function NodeEditRenderer(
  {
    path,
    errorRenderer,
    cancel,
    startingData
  }: NodeEditRendererProps) {

  const ErrorDisplayComponent: ComponentType<ErrorRendererProps> = errorRenderer || DefaultError

  if(path?.length < 2) return <ErrorDisplayComponent err={new Error('An absolute path (containiedng at least two path segments) is required.')} />

  if (!cancel) return <ErrorDisplayComponent err={new Error('A cancel function is required')} />

  const [ loadedTreeState, setLoadedTreeState ] = useState<{ childPath: Array<PathSegment>, childConfig: NodeConfig | null }>({
    childPath: path,
    childConfig: null
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

  useEffect(() => {
    (async () => {
      const childConfig = await getConfigAt(topNodeConfig, path.slice(2), (path => getValue(startingData, path)))
      if(!childConfig) throw new Error(`Couldn't find config for ${path.join('/')}`)
      setLoadedTreeState({
        childPath: path,
        childConfig
      })
    })()
  }, [ topNodeConfig, path ])

  if (!startingData) return null
  if(!loadedTreeState.childConfig) return null

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

        <TypeRenderer
          globalPath={loadedTreeState.childPath}
          config={loadedTreeState.childConfig}
          originalTreeData={startingData}
          options={childRegistration.options}
          ErrorDisplayComponent={ErrorDisplayComponent}
        />

        <div className='border-t pt-10'>

          <Suspense fallback={<div>Loading validation...</div>}>
            <ValidationSummary config={topNodeConfig} path={topNodePath} />
          </Suspense>

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


