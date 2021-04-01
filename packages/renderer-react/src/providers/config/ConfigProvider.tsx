import React, {createContext, useContext} from 'react';
import { NodeConfig, PathSegment } from "@graphter/core";

interface ConfigProviderProps {
  configs: Array<NodeConfig>
  children: any
}

const Context = createContext<Map<string | number, NodeConfig> | null>(null);

let configMap: Map<string | number, NodeConfig>

export function getConfig(id: string | number): NodeConfig {
  if(!configMap) throw new Error(`Couldn't find the API service registry. Make sure you've declared a <ServiceProvider /> and passed it a valid service.`)
  const service = configMap.get(id)
  if(!service) throw new Error(`Missing '${id}' config`)
  return service
}

export function useConfig(id: string | number): NodeConfig {
  const configMap = useContext(Context)
  if(!configMap) throw new Error(`Couldn't find the config registry. Make sure you've declared a <ConfigProvider /> and passed it valid config.`)
  const config = configMap.get(id)
  if(!config) throw new Error(`Missing '${id}' config`)
  return config
}

export default function ConfigProvider({ configs, children }: ConfigProviderProps){
  configMap = configs.reduce((a, c) => {
    if(Array.isArray(c)) c.forEach(registration => a.set(registration.id, registration.config))
    else a.set(c.id, c)
    return a
  }, new Map<string, NodeConfig>())

  return (
    <Context.Provider value={configMap}>
      {children}
    </Context.Provider>
  );
}