/***
 * This module needs to be broken up and much of it moved out of the package
 */
import React, { ComponentType, Suspense } from "react";
import DefaultError from "../default-error"
import {
  ErrorRendererProps,
  PathSegment,
} from "@graphter/core"
import nodeRendererStore from "../store/nodeRendererStore"
import ValidationSummary from "./ValidationSummary";
import { useConfig } from "../providers/config";
import { useNodeConfigs, useTreeDataCallback } from "../providers/state";

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

  const topNodeConfigId = path[0]
  const editingId = path[1]
  const topNodePath = path.slice(0, 2)

  const topNodeConfig = useConfig(topNodeConfigId)

  const save = useTreeDataCallback(
    (treeData) => {
      console.log('saving model ', treeData)
    },
    path)

  const [ nodeConfigs ] = useNodeConfigs(path)

  if(!nodeConfigs?.length) throw new Error(`Missing config at '${path.join('/')}'`)

  const childConfig = nodeConfigs[0]
  const childRegistration = nodeRendererStore.get(childConfig.type)
  if(!childRegistration) throw new Error(`No child renderer found for type '${childConfig.type}'`)
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
          <h1 className='text-2xl'>{childConfig.name}</h1>
          {childConfig.description && <p className='text-sm text-gray-500'>{childConfig.description}</p>}
        </div>

        <Suspense fallback={<div>Loading validation...</div>}>
        <TypeRenderer
          path={path}
          config={childConfig}
          originalTreeData={startingData}
          options={childRegistration.options}
          ErrorDisplayComponent={ErrorDisplayComponent}
        />
        </Suspense>
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


