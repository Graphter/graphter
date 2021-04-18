import React, { createContext, useContext } from 'react';
import { PathSegment } from "@graphter/core";
import { NodeDataHook } from "./NodeDataHook";
import { TreeDataHook } from "./TreeDataHook";
import { TreePathsHook } from "./TreePathsHook";
import { TreeDataInitialiserHook } from "./TreeDataInitialiserHook";
import { TreeDataCallbackHook } from "./TreeDataCallbackHook";
import { MultipleNodeDataHook } from "./MultipleNodeDataHook";

interface DataProviderProps {
  treeDataInitialiserHook: TreeDataInitialiserHook
  nodeDataHook: NodeDataHook
  multipleNodeDataHook: MultipleNodeDataHook
  treeDataHook: TreeDataHook
  treeDataCallbackHook: TreeDataCallbackHook
  treePathsHook: TreePathsHook
  children: any
}

const Context = createContext<{
  treeDataInitialiserHook: TreeDataInitialiserHook
  nodeDataHook: NodeDataHook
  multipleNodeDataHook: MultipleNodeDataHook
  treeDataHook: TreeDataHook
  treeDataCallbackHook: TreeDataCallbackHook
  treePathsHook: TreePathsHook
} | null>(null)

export const useTreeDataInitialiser: TreeDataInitialiserHook = () => {
  const ctx = useContext(Context);
  if (!ctx || !ctx.treeDataInitialiserHook) throw new Error(`Couldn't find a TreeDataInitialiserHook or context to use.`);
  return ctx.treeDataInitialiserHook()
}

export function useNodeData<D>(
  path: Array<PathSegment>
): [D, (nodeData: D) => void] {
  const ctx = useContext(Context);
  if (!ctx || !ctx.nodeDataHook) throw new Error(`Couldn't find a NodeDataHook or context to use.`);
  return ctx.nodeDataHook(path);
}

export function useMultipleNodeData(
  paths: Array<Array<PathSegment>>
): Array<{ path: Array<PathSegment>, data: any }> {
  const ctx = useContext(Context);
  if (!ctx || !ctx.multipleNodeDataHook) throw new Error(`Couldn't find a MultipleNodeDataHook or context to use.`);
  return ctx.multipleNodeDataHook(paths);
}

export const useTreeData:TreeDataHook = (
  config,
  path: Array<PathSegment>,
  depth?: number
) => {
  const ctx = useContext(Context)
  if (!ctx || !ctx.treeDataHook) throw new Error(`Couldn't find a TreeDataHook or context to use.`)
  return ctx.treeDataHook(config, path, depth)
}

export const useTreeDataCallback:TreeDataCallbackHook = (
  fn: (data: any) => void,
  config,
  path: Array<PathSegment>,
  depth?: number) => {
  const ctx = useContext(Context)
  if (!ctx || !ctx.treeDataHook) throw new Error(`Couldn't find a TreeDataCallbackHook or context to use.`)
  return ctx.treeDataCallbackHook(fn, config, path, depth)
}

export const useTreePaths:TreePathsHook = (config, path) => {
  const ctx = useContext(Context)
  if (!ctx || !ctx.treePathsHook) throw new Error(`Couldn't find a TreePathsHook or context to use.`)
  return ctx.treePathsHook(config, path)
}

export default function StateProvider(
  {
    treeDataInitialiserHook,
    nodeDataHook,
    multipleNodeDataHook,
    treeDataHook,
    treeDataCallbackHook,
    treePathsHook,
    children
  }: DataProviderProps
) {
  return (
    <Context.Provider value={{
      treeDataInitialiserHook,
      nodeDataHook,
      multipleNodeDataHook,
      treeDataCallbackHook,
      treeDataHook,
      treePathsHook
    }}>
      {children}
    </Context.Provider>
  );
}