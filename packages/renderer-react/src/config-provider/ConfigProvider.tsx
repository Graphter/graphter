import React, {createContext, useContext} from 'react';
import { NodeConfig, PathSegment } from "@graphter/core";

interface ConfigProviderProps {
  configs: Array<NodeConfig>
  children: any
}

const Context = createContext<Map<PathSegment, NodeConfig> | null>(null);

export function useConfig(id: string): NodeConfig {
  const configMap = useContext(Context)
  if(!configMap) throw new Error(`Couldn't find the config registry. Make sure you've declared a <ConfigProvider /> and passed it valid config.`)
  const config = configMap.get(id)
  if(!config) throw new Error(`Missing '${id}' config`)
  return config
}

export default function ConfigProvider({ configs, children }: ConfigProviderProps){
  const configMap = configs.reduce((a, c) => {
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