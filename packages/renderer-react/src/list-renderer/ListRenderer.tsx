import React, { useEffect, useState, ReactNode, ComponentType, Fragment } from 'react'
import ErrorBoundary from "../error-boundary";
import DefaultError from "../default-error";
import { RenderItemProps } from "./RenderItemProps";
import { RenderPaginationProps } from "./RenderPaginationProps";
import { ErrorRendererProps, NodeConfig } from "@graphter/core";
import serviceStore from "../store/serviceStore";

export interface ListRendererProps {
  config: NodeConfig
  renderItem: ({ item, index}: RenderItemProps) => ReactNode
  renderPagination?: ({ count }: RenderPaginationProps) => ReactNode
  errorRenderer?: ComponentType<{ err: Error | string }>
  page?: number
  size?: number
}

export default function ListRenderer(
  {
    config,
    renderItem,
    renderPagination,
    errorRenderer,
    page,
    size }: ListRendererProps): any {
  const ErrorDisplayComponent: ComponentType<ErrorRendererProps> = errorRenderer || DefaultError;
  if(!config) return <ErrorDisplayComponent err={new Error('Model configuration is required')} />;

  const service = serviceStore.get(config.id);

  const [ count, setCount ] = useState(0);
  const [ items, setItems ] = useState<Array<any>>([]);
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState<Error>();

  useEffect(() => {
    (async () => {
      setLoading(true);
      let listResult;
      try {
        const take = size || 10;
        const skip = page ? (page - 1) * take : 0;
        listResult = await service.list(skip, take);
      } catch(err){
        setLoading(false);
        setError(err);
        return;
      }
      setItems(listResult.items);
      setCount(listResult.count);
      setLoading(false);
    })()
  }, [ config, page, size ]);

  if(!renderItem) return <ErrorDisplayComponent err={'Missing list item renderer control'} />;

  return (
    <Fragment>
      { error && <ErrorDisplayComponent err={error} /> }
      { loading && <div>loading...</div> }
      <div data-testid='list'>

      {items.map((item, i) => (
        renderItem && (
          <ErrorBoundary
            key={i}
            errorRenderer={ErrorDisplayComponent}>
            {renderWithErrorHandling(() => renderItem({ item }))}
          </ErrorBoundary>)
        ))}
      </div>

      {renderPagination && (
        <ErrorBoundary errorRenderer={ErrorDisplayComponent}>
          {renderWithErrorHandling(() => renderPagination({count}))}
        </ErrorBoundary>
      )}
    </Fragment>
  );

  function renderWithErrorHandling(fn: () => any){
    try {
      return fn();
    } catch(err) {
      return <ErrorDisplayComponent err={err} />
    }
  }
}