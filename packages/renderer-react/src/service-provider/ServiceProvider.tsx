import React, {createContext, useContext} from 'react';
import { NodeConfig, PathSegment, Service } from "@graphter/core";

export interface ServiceRegistration {
  id: string,
  service: Service
}

interface ServiceProviderProps {
  serviceRegistry: Array<ServiceRegistration | Array<ServiceRegistration>>
  children: any
}

const Context = createContext<Map<PathSegment, Service> | null>(null);

let serviceMap: Map<PathSegment, Service>

export function getService(id: string): Service {
  if(!serviceMap) throw new Error(`Couldn't find the API service registry. Make sure you've declared a <ServiceProvider /> and passed it a valid service.`)
  const service = serviceMap.get(id)
  if(!service) throw new Error(`Missing a service to handle '${id}' data`)
  return service
}

export function useService(id: string): Service {
  const serviceMap = useContext(Context)
  if(!serviceMap) throw new Error(`Couldn't find the API service registry. Make sure you've declared a <ServiceProvider /> and passed it a valid service.`)
  const service = serviceMap.get(id)
  if(!service) throw new Error(`Missing a service to handle '${id}' data`)
  return service
}

export default function ServiceProvider({ serviceRegistry, children }: ServiceProviderProps){
  serviceMap = serviceRegistry.reduce((a, c) => {
    if(Array.isArray(c)) c.forEach(registration => a.set(registration.id, registration.service))
    else a.set(c.id, c.service)
    return a
  }, new Map<PathSegment, Service>())
  return (
    <Context.Provider value={serviceMap}>
      {children}
    </Context.Provider>
  );
}