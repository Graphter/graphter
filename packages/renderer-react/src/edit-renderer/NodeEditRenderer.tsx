import React, { ComponentType, Suspense, useEffect, useState } from "react";
import s from './NodeEditRenderer.pcss';
import { isEmpty } from "../util/id";
import { useService } from "../service-provider/ServiceProvider";
import DefaultError from "../default-error";
import {
  ErrorRendererProps,
  NodeRendererRegistration,
} from "@graphter/core"
import nodeRendererStore from "../store/nodeRendererStore"
import ValidationSummary from "./ValidationSummary";
import { useTreeData } from "../node-data-provider";
import { useConfig } from "../config-provider";

export interface NodeEditRendererProps {
  configId: string
  editingId?: string | number
  errorRenderer?: ComponentType<ErrorRendererProps>
  onSaved?: (modelId: string, instance: any) => void
  cancel: (modelId: string | undefined, instance: any) => void
  typeRegistry: Array<NodeRendererRegistration>
}

export default function NodeEditRenderer(
  {
    editingId,
    configId,
    errorRenderer,
    cancel,
    typeRegistry
  }: NodeEditRendererProps) {

  const ErrorDisplayComponent: ComponentType<ErrorRendererProps> = errorRenderer || DefaultError;

  if (!configId) return <ErrorDisplayComponent err={new Error('A config ID is required')}/>;
  if (!cancel) return <ErrorDisplayComponent err={new Error('A cancel function is required')}/>;

  nodeRendererStore.registerAll(typeRegistry)

  const config = useConfig(configId)

  const service = useService(configId);

  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState<Error>();
  const [ startingData, setStartingData ] = useState<any>(undefined);

  const save = useTreeData(
    (treeData) => {
      console.log('saving model ', treeData)
    },
    [ configId, editingId === undefined ? 'new' : editingId ])

  useEffect(() => {
    (async () => {
      if (isEmpty(editingId)) {
        setLoading(false);
      } else {
        try {
          const getResult = await service.get(editingId);
          setLoading(false);
          if (!getResult.item) {
            setError(new Error(`Couldn't find a ${config.name} with ID '${editingId}'`));
            return;
          }
          setStartingData(getResult.item)
        } catch (err) {
          console.error(err);
          setLoading(false);
          setError(new Error(`There was a problem loading that ${config.name}: ${err.message}`));
          return;
        }
      }
    })()
  }, [ editingId ]);

  if (!startingData) return null
  const registration = nodeRendererStore.get(config.type)
  const TypeRenderer = registration.Renderer

  const path = [ config.id, editingId !== undefined ? editingId : 'new' ]

  return (
    <div className={s.editRenderer}>

      {error && <ErrorDisplayComponent err={error}/>}

      {loading && <div className={s.editRenderer} data-testid='loading'>loading...</div>}

      <form onSubmit={e => {
        e.preventDefault();
        (async () => {
          await save()
        })()
      }} data-testid='form'>

        <h1 className={s.name}>{config.name}</h1>
        {config.description && <p>{config.description}</p>}

        <TypeRenderer
          committed={true}
          path={path}
          config={config}
          configAncestry={[]}
          originalNodeData={startingData}
          originalNodeDataAncestry={[]}
          options={registration.options}
          ErrorDisplayComponent={ErrorDisplayComponent}
        />

        <ValidationSummary path={path}/>

        <div className={s.controls}>
          <button type='submit' data-testid='save' className={s.save}>Save</button>
          <button type='button' data-testid='cancel' className={s.cancel}
                  onClick={() => cancel(config.id, editingId)}>Cancel
          </button>
        </div>
      </form>
    </div>
  );

}


