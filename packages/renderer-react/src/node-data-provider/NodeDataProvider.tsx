import React, { createContext, useContext, useMemo } from 'react';
import { NodeConfig, PathSegment } from "@graphter/core";
import { nanoid } from "nanoid";
import useRecoilArrayNodeData from "./useRecoilArrayNodeData";
import { useRecoilCallback } from "recoil";
import modelDataStore from "../store/modelDataStore";

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
  arrayNodeDataHook: ArrayNodeDataHook
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
  const ctx = useContext(Context);
  if (!ctx || !ctx.arrayNodeDataHook) throw new Error(`Couldn't find an ArrayNodeDataHook or context to use.`);
  if(!Array.isArray(originalChildData)) throw new Error(`'${config.type}' renderer only works with arrays`)

  return ctx.arrayNodeDataHook(path, config, originalChildData, committed)
}

export function useTreeData(fn: (data: any) => void, path: Array<PathSegment>): () => void {
  return useRecoilCallback(({ snapshot }) => async () => {
    const tree = await snapshot.getPromise(modelDataStore.get(path))
    fn(tree)
  })
}

export function useTreePaths(path: Array<PathSegment>){

}

export default function NodeDataProvider(
  {
    nodeDataHook,
    arrayNodeDataHook,
    children
  }: DataProviderProps
) {
  return (
    <Context.Provider value={{ nodeDataHook, arrayNodeDataHook }}>
      {children}
    </Context.Provider>
  );
}