/***
 * This module needs to be broken up and much of it moved out of the package
 */
import React, { ComponentType, useEffect, useState } from "react";
import s from './NodeEditRenderer.pcss';
import { isEmpty } from "../util/id";
import { useService } from "../providers/service";
import DefaultError from "../default-error";
import {
  ErrorRendererProps,
  NodeRendererRegistration, PathSegment,
} from "@graphter/core"
import nodeRendererStore from "../store/nodeRendererStore"
import ValidationSummary from "./ValidationSummary";
import { useConfig } from "../providers/config";
import { useTreeDataCallback, useTreeDataInitialiser } from "../providers/node-data";

export interface NodeEditRendererProps {
  path: Array<PathSegment>
  errorRenderer?: ComponentType<ErrorRendererProps>
  onSaved?: (modelId: string, instance: any) => void
  cancel: (modelId: string | undefined, instance: any) => void
  typeRegistry: Array<NodeRendererRegistration>
}

export default function NodeEditRenderer(
  {
    path,
    errorRenderer,
    cancel,
    typeRegistry
  }: NodeEditRendererProps) {

  const ErrorDisplayComponent: ComponentType<ErrorRendererProps> = errorRenderer || DefaultError

  if(path?.length < 2) return <ErrorDisplayComponent err={new Error('An absolute path (containing at least two path segments) is required.')} />

  if (!cancel) return <ErrorDisplayComponent err={new Error('A cancel function is required')} />

  nodeRendererStore.registerAll(typeRegistry)

  const topNodeConfigId = path[0]
  const editingId = path[1]
  const localPath = path.slice(2)
  const topNodePath = path.slice(0, 2)

  const topNodeConfig = useConfig(topNodeConfigId)
  const service = useService(topNodeConfigId)

  const [ loading, setLoading ] = useState(true)
  const [ error, setError ] = useState<Error>()
  const [ startingData, setStartingData ] = useState<any>(undefined)
  const treeDataInitialiser = useTreeDataInitialiser()
  const save = useTreeDataCallback(
    (treeData) => {
      console.log('saving model ', treeData)
    },
    topNodeConfig,
    path)


  useEffect(() => {
    (async () => {
      if (isEmpty(editingId)) {
        setLoading(false)
      } else {
        try {
          const getResult = await service.get(editingId);
          setLoading(false)
          if (!getResult.item) {
            setError(new Error(`Couldn't find a ${topNodeConfig.name} with ID '${editingId}'`))
            return;
          }
          treeDataInitialiser(topNodeConfig, path.slice(0, 2), true, getResult.item)
          setStartingData(getResult.item)
        } catch (err) {
          console.error(err)
          setLoading(false)
          setError(new Error(`There was a problem loading that ${topNodeConfig.name}: ${err.message}`));
          return;
        }
      }
    })()
  }, [ editingId, path ]);

  if (!startingData) return null

  const registration = nodeRendererStore.get(topNodeConfig.type)
  if(!registration) throw new Error(`No renderer found for type '${topNodeConfig.type}'`)
  const configs = registration.getChildConfig ?
    registration.getChildConfig([ topNodeConfig ], localPath, localPath, startingData) :
    [ topNodeConfig ]
  const childConfig = configs[configs.length - 1]
  const childRegistration = nodeRendererStore.get(childConfig.type)
  if(!childRegistration) throw new Error(`No child renderer found for type '${childConfig.type}'`)
  const TypeRenderer = childRegistration.Renderer

  return (
    <div className='' data-testid='node-edit-renderer' >

      {error && <ErrorDisplayComponent err={error}/>}

      {loading && <div className={s.editRenderer} data-testid='loading'>loading...</div>}

      <form onSubmit={e => {
        e.preventDefault();
        (async () => {
          await save()
        })()
      }} data-testid='form'>

        <h1 className='text-2xl mt-8'>{childConfig.name}</h1>
        {childConfig.description && <p className='text-sm text-gray-500 mb-10'>{childConfig.description}</p>}

        <TypeRenderer
          committed={true}
          globalPath={path}
          config={childConfig}
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


