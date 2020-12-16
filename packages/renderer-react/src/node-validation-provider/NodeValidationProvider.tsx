import React, { createContext, useContext } from 'react';
import { NodeValidatorRegistration, PathSegment, ValidationResult } from "@graphter/core";
import { NodeValidationHook } from "./NodeValidationHook";
import { AggregateNodeValidationHook } from "./AggregateNodeValidationHook";
import NodeValidationData from "./NodeValidationData";

interface DataProviderProps {
  instanceId: string | number,
  nodeValidationHook: NodeValidationHook,
  aggregateNodeValidationHook: AggregateNodeValidationHook,
  validatorRegistry: Array<NodeValidatorRegistration>
  children: any
}

const Context = createContext<{
  instanceId: string | number,
  nodeValidationHook: NodeValidationHook,
  aggregateNodeValidationHook: AggregateNodeValidationHook,
  validatorRegistry: Array<NodeValidatorRegistration>
} | null>(null);

export const useNodeValidation = (
  path: Array<PathSegment>
): NodeValidationData => {
  const ctx = useContext(Context);
  if(!ctx) throw new Error('No validation provider found. Make sure a <NodeValidationProvider /> is defined.')
  if (!ctx.nodeValidationHook) throw new Error(`Couldn't find a NodeValidationHook to use.`);
  if(!ctx.validatorRegistry) throw new Error('No validators have been defined. Please ensue <NodeValidationProvider /> has been defined correctly.')

  return ctx.nodeValidationHook(path, ctx.validatorRegistry);
}

export const useAggregateNodeValidation = (
  paths: Array<Array<PathSegment>>
): Array<NodeValidationData> => {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('No validation provider found. Make sure a <NodeValidationProvider /> is defined.')
  if (!ctx.aggregateNodeValidationHook) throw new Error(`Couldn't find a aggregateNodeValidationHook to use.`)

  return ctx.aggregateNodeValidationHook(paths);
}

export default function NodeValidationProvider(
  {
    instanceId,
    nodeValidationHook,
    aggregateNodeValidationHook,
    validatorRegistry,
    children
  }: DataProviderProps
) {
  return (
    <Context.Provider value={{
      instanceId,
      nodeValidationHook,
      aggregateNodeValidationHook,
      validatorRegistry
    }}>
      {children}
    </Context.Provider>
  );
}