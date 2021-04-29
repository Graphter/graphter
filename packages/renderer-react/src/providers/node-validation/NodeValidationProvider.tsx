import React, { createContext, useContext } from 'react';
import { NodeValidatorRegistration } from "@graphter/core";

interface ValidationProviderProps {
  validatorRegistry: Array<NodeValidatorRegistration>
  children: any
}

const Context = createContext<{
  validatorRegistryMap: Map<string, NodeValidatorRegistration>
} | null>(null);

export const useNodeValidator = (
  type: string
): NodeValidatorRegistration | null => {
  const ctx = useContext(Context);
  if(!ctx) throw new Error('No validation provider found. Make sure a <NodeValidationProvider /> is defined.')
  return ctx.validatorRegistryMap.get(type) || null
}

export function NodeValidationProvider(
  {
    validatorRegistry,
    children
  }: ValidationProviderProps
) {
  const validatorRegistryMap = validatorRegistry.reduce((a, c) => {
    a.set(c.type, c)
    return a
  }, new Map<string, NodeValidatorRegistration>())
  return (
    <Context.Provider value={{
      validatorRegistryMap
    }}>
      {children}
    </Context.Provider>
  );
}