import React, { createContext, useContext } from 'react';
import { NodeConfig, NodeValidatorRegistration, PathSegment } from "@graphter/core";
import { NodeValidationHook } from "./NodeValidationHook";
import { AggregateNodeValidationHook } from "./AggregateNodeValidationHook";
import { NodeValidationData } from "./NodeValidationData";

interface ValidationProviderProps {
  nodeValidationHook: NodeValidationHook,
  aggregateNodeValidationHook: AggregateNodeValidationHook,
  validatorRegistry: Array<NodeValidatorRegistration>
  children: any
}

const Context = createContext<{
  nodeValidationHook: NodeValidationHook,
  aggregateNodeValidationHook: AggregateNodeValidationHook,
  validatorRegistry: Array<NodeValidatorRegistration>
} | null>(null);

export const useNodeValidation = (
  config: NodeConfig,
  path: Array<PathSegment>
): NodeValidationData => {
  const ctx = useContext(Context);
  if(!ctx) throw new Error('No validation provider found. Make sure a <NodeValidationProvider /> is defined.')
  if (!ctx.nodeValidationHook) throw new Error(`Couldn't find a NodeValidationHook to use.`);
  if(!ctx.validatorRegistry) throw new Error('No validators have been defined. Please ensue <NodeValidationProvider /> has been defined correctly.')

  return ctx.nodeValidationHook(config, path, ctx.validatorRegistry);
}

export const useAggregateNodeValidation = (
  paths: Array<Array<PathSegment>>
): Array<NodeValidationData> => {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('No validation provider found. Make sure a <NodeValidationProvider /> is defined.')
  if (!ctx.aggregateNodeValidationHook) throw new Error(`Couldn't find a aggregateNodeValidationHook to use.`)

  return ctx.aggregateNodeValidationHook(paths);
}

export function NodeValidationProvider(
  {
    nodeValidationHook,
    aggregateNodeValidationHook,
    validatorRegistry,
    children
  }: ValidationProviderProps
) {
  return (
    <Context.Provider value={{
      nodeValidationHook,
      aggregateNodeValidationHook,
      validatorRegistry
    }}>
      {children}
    </Context.Provider>
  );
}