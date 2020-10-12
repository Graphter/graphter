import React, { ComponentType, useEffect, useState } from "react";
import s from './NodeEditRenderer.pcss';
import { isEmpty } from "../util/id";
import { useService } from "../service-provider/ServiceProvider";
import DefaultError from "../default-error";
import {
  RecoilRoot, useRecoilCallback,
} from 'recoil';
import {
  NodeConfig,
  ErrorRendererProps,
  NodeRendererRegistration,
} from "microo-core"
import nodeRendererStore from "../store/nodeRendererStore"
import { nanoid } from 'nanoid'
import modelDataStore from "../store/modelDataStore";

export interface NodeEditRendererProps {
  config: NodeConfig
  editingId?: string | number
  errorRenderer?: ComponentType<ErrorRendererProps>
  onSaved?: (modelId: string, instance: any) => void
  cancel: (modelId: string | undefined, instance: any) => void
  typeRegistry: Array<NodeRendererRegistration>
  children: any
}

export default function NodeEditRenderer(
  {
    editingId,
    config,
    errorRenderer,
    onSaved,
    cancel,
    typeRegistry,
    children
  }: NodeEditRendererProps) {

  const ErrorDisplayComponent: ComponentType<ErrorRendererProps> = errorRenderer || DefaultError;

  if (!config) return <ErrorDisplayComponent err={new Error('Configuration is required')}/>;
  if (!cancel) return <ErrorDisplayComponent err={new Error('A cancel function is required')}/>;

  nodeRendererStore.registerAll(typeRegistry)

  const service = useService();

  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState<Error>();
  const [ startingData, setStartingData ] = useState<any>(undefined);
  const save = useRecoilCallback(({ snapshot }) => async () => {
    const model = await snapshot.getPromise(modelDataStore.get(typeof editingId === 'undefined' ? 'new' : editingId, config))
    console.log('saving model ', model)
  })

  useEffect(() => {
    (async () => {
      if (isEmpty(editingId)) {
        setLoading(false);
      } else {
        try {
          const getResult = await service.get(config.id, editingId);
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

  if(!startingData) return null
  const registration = nodeRendererStore.get(config.type)
  const TypeRenderer = registration.renderer

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

        <h1>{config.name}</h1>
        {config.description && <p>{config.description}</p>}

        <TypeRenderer
            committed={true}
            path={[config.id, editingId || 'new']}
            config={config}
            originalNodeData={startingData}
            options={registration.options}
            ErrorDisplayComponent={ErrorDisplayComponent}
        />

        <div className={s.controls}>
          <button type='submit' data-testid='save'>Save</button>
          <button type='button' data-testid='cancel' onClick={() => cancel(config.id, editingId)}>Cancel</button>
        </div>
      </form>
    </div>
  );

}


