/***
 * This module needs to be broken up and much of it moved out of the package
 */
import React, { ComponentType } from "react";
import DefaultError from "../default-error";
import {
  ErrorRendererProps,
  NodeRendererRegistration, PathSegment,
} from "@graphter/core"
import nodeRendererStore from "../store/nodeRendererStore"
import ValidationSummary from "./ValidationSummary";
import { useConfig } from "../providers/config";
import { useTreeDataCallback } from "../providers/state";

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

  if(path?.length < 2) return <ErrorDisplayComponent err={new Error('An absolute path (containing at least two path segments) is required.')} />

  if (!cancel) return <ErrorDisplayComponent err={new Error('A cancel function is required')} />


  const topNodeConfigId = path[0]
  const editingId = path[1]
  const localPath = path.slice(2)
  const topNodePath = path.slice(0, 2)

  const topNodeConfig = useConfig(topNodeConfigId)

  const save = useTreeDataCallback(
    (treeData) => {
      console.log('saving model ', treeData)
    },
    topNodeConfig,
    path)

  if (!startingData) return null

  const registration = nodeRendererStore.get(topNodeConfig.type)
  if(!registration) throw new Error(`No renderer found for type '${topNodeConfig.type}'`)
  const configs = registration.getChildConfig ?
    registration.getChildConfig(topNodeConfig, [], [ ...localPath ], startingData) :
    [ { config: topNodeConfig, path: localPath } ]
  const childConfig = configs[configs.length - 1]
  const childRegistration = nodeRendererStore.get(childConfig.config.type)
  if(!childRegistration) throw new Error(`No child renderer found for type '${childConfig.config.type}'`)
  const TypeRenderer = childRegistration.Renderer

  return (
    <div className='' data-testid='node-edit-renderer' >

      <form onSubmit={e => {
        e.preventDefault();
        (async () => {
          await save()
        })()
      }} data-testid='form'>

        <h1 className='text-2xl mt-8'>{childConfig.config.name}</h1>
        {childConfig.config.description && <p className='text-sm text-gray-500 mb-10'>{childConfig.config.description}</p>}

        <TypeRenderer
          committed={true}
          globalPath={path}
          config={childConfig.config}
          originalTreeData={startingData}
          options={registration.options}
          ErrorDisplayComponent={ErrorDisplayComponent}
        />

        <div className='border-t pt-10'>

          <ValidationSummary config={topNodeConfig} path={topNodePath} />

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


