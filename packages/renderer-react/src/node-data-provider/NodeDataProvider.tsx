import React, { createContext, useContext, useMemo } from 'react';
import { NodeConfig, PathSegment } from "@graphter/core";

interface DataProviderProps {
  instanceId: string | number
  nodeDataHook: NodeDataHook
  arrayNodeDataHook: ArrayNodeDataHook
  treeDataHook: TreeDataHook
  treePathsHook: TreePathsHook
  children: any
}

export interface NodeDataHook {
  (
    path: Array<PathSegment>,
    config: NodeConfig,
    originalNodeData: any,
    committed: boolean,
  ): [ any, (value: any) => void ]
}
export interface ArrayNodeDataHook {
  (
    path: Array<PathSegment>,
    config: NodeConfig,
    originalNodeData: Array<any>,
    committed: boolean,
  ): {
    childIds: Array<string>,
    removeItem: (index: number) => void,
    commitItem: (index: number) => void
  }
}
export interface TreeDataHook {
  (
    fn: (data: any) => void, path: Array<PathSegment>
  ): () => void
}
export interface TreePathsHook {
  (path: Array<PathSegment>): Array<Array<PathSegment>>
}

const Context = createContext<{
  nodeDataHook: NodeDataHook,
  arrayNodeDataHook: ArrayNodeDataHook,
  treeDataHook: TreeDataHook,
  treePathsHook: TreePathsHook
} | null>(null);

export function useNodeData<D>(
  path: Array<PathSegment>,
  config: NodeConfig,
  originalNodeData: D,
  committed: boolean = true,
): [D, (nodeData: D) => void] {
  const ctx = useContext(Context);
  if (!ctx || !ctx.nodeDataHook) throw new Error(`Couldn't find a NodeDataHook or context to use.`);
  return ctx.nodeDataHook(path, config, originalNodeData, committed);
}

export function useArrayNodeData<D>(
  path: Array<PathSegment>,
  config: NodeConfig,
  originalChildData: Array<D>,
  committed: boolean = true,
): {
  childIds: Array<string>,
  removeItem: (index: number) => void,
  commitItem: (index: number) => void
} {
  const ctx = useContext(Context)
  if (!ctx || !ctx.arrayNodeDataHook) throw new Error(`Couldn't find an ArrayNodeDataHook or context to use.`)
  if(!Array.isArray(originalChildData)) throw new Error(`'${config.type}' renderer only works with arrays`)

  return ctx.arrayNodeDataHook(path, config, originalChildData, committed)
}

export const useTreeData:TreeDataHook = (fn: (data: any) => void, path: Array<PathSegment>) => {
  const ctx = useContext(Context)
  if (!ctx || !ctx.treeDataHook) throw new Error(`Couldn't find a TreeDataHook or context to use.`)
  return ctx.treeDataHook(fn, path)
}

export const useTreePaths:TreePathsHook = (path: Array<PathSegment>) => {
  const ctx = useContext(Context)
  if (!ctx || !ctx.treePathsHook) throw new Error(`Couldn't find a TreePathsHook or context to use.`)
  return ctx.treePathsHook(path)
}

export default function NodeDataProvider(
  {
    nodeDataHook,
    treeDataHook,
    treePathsHook,
    arrayNodeDataHook,
    children
  }: DataProviderProps
) {
  return (
    <Context.Provider value={{
      nodeDataHook,
      arrayNodeDataHook,
      treeDataHook,
      treePathsHook
    }}>
      {children}
    </Context.Provider>
  );
}