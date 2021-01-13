import React, {createContext, useContext} from 'react';
import { Service } from "@graphter/core";

interface DataProviderProps {
  service: Service,
  children: any
}

const Context = createContext<Service | null>(null);

export function useService(): Service {
  const service = useContext(Context);
  if(!service) throw new Error(`Couldn't find API service. Make sure you've declared a ServiceProvider and passed it a valid service.`);
  return service;
}

export default function ServiceProvider({ service, children }: DataProviderProps){
  return (
    <Context.Provider value={service}>
      {children}
    </Context.Provider>
  );
}