import React, { createContext, useContext } from 'react';
import { NodeValidatorRegistration, PathSegment, ValidationResult } from "@graphter/core";

interface DataProviderProps {
  instanceId: string | number,
  nodeValidationHook: NodeValidationHook,
  validatorRegistry: Array<NodeValidatorRegistration>
  children: any
}

export interface NodeValidationHook {
  (
    path: Array<PathSegment>,
    validatorRegistry: Array<NodeValidatorRegistration>
  ): Array<ValidationResult>
}

const Context = createContext<{
  instanceId: string | number,
  nodeValidationHook: NodeValidationHook,
  validatorRegistry: Array<NodeValidatorRegistration>
} | null>(null);

export const useNodeValidation = (
  path: Array<PathSegment>
): Array<ValidationResult> => {
  const ctx = useContext(Context);
  if(!ctx) throw new Error('No validation provider found. Make sure a <NodeValidationProvider /> is defined.')
  if (!ctx.nodeValidationHook) throw new Error(`Couldn't find a NodeValidationHook to use.`);
  if(!ctx.validatorRegistry) throw new Error('No validators have been defined. Please ensue <NodeValidationProvider /> has been defined correctly.')

  return ctx.nodeValidationHook(path, ctx.validatorRegistry);

}

export default function NodeValidationProvider(
  {
    instanceId,
    nodeValidationHook,
    validatorRegistry,
    children
  }: DataProviderProps
) {
  return (
    <Context.Provider value={{ instanceId, nodeValidationHook, validatorRegistry }}>
      {children}
    </Context.Provider>
  );
}