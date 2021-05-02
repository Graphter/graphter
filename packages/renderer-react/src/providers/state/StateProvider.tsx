import React, { createContext, useContext } from 'react';
import { NodeConfig, PathSegment } from "@graphter/core";
import { NodeDataHook } from "./NodeDataHook";
import { TreeDataHook } from "./TreeDataHook";
import { TreeDataInitialiserHook } from "./TreeDataInitialiserHook";
import { TreeDataCallbackHook } from "./TreeDataCallbackHook";
import { NodeConfigsHook } from "./NodeConfigsHook";

interface DataProviderProps {
  treeDataInitialiserHook: TreeDataInitialiserHook
  nodeDataHook: NodeDataHook
  treeDataHook: TreeDataHook
  treeDataCallbackHook: TreeDataCallbackHook
  nodeConfigsHook: NodeConfigsHook
  children: any
}

const Context = createContext<{
  treeDataInitialiserHook: TreeDataInitialiserHook
  nodeDataHook: NodeDataHook
  treeDataHook: TreeDataHook
  treeDataCallbackHook: TreeDataCallbackHook
  nodeConfigsHook: NodeConfigsHook
} | null>(null)

export const useTreeDataInitialiser: TreeDataInitialiserHook = () => {
  const ctx = useContext(Context);
  if (!ctx || !ctx.treeDataInitialiserHook) throw new Error(`Couldn't find a TreeDataInitialiserHook or context to use.`);
  return ctx.treeDataInitialiserHook()
}

export function useNodeData<D>(
  path: Array<PathSegment>,
  config: NodeConfig,
  originalTreeData: any
): [D, (nodeData: D) => void] {
  const ctx = useContext(Context)
  if (!ctx || !ctx.nodeDataHook) throw new Error(`Couldn't find a NodeDataHook or context to use.`)
  return ctx.nodeDataHook<D>(path, config, originalTreeData)
}

export const useTreeData:TreeDataHook = (
  path: Array<PathSegment>,
  depth?: number
) => {
  const ctx = useContext(Context)
  if (!ctx || !ctx.treeDataHook) throw new Error(`Couldn't find a TreeDataHook or context to use.`)
  return ctx.treeDataHook(path, depth)
}

export const useTreeDataCallback:TreeDataCallbackHook = (
  fn: (data: any) => void,
  path: Array<PathSegment>,
  depth?: number) =>
{
  const ctx = useContext(Context)
  if (!ctx || !ctx.treeDataHook) throw new Error(`Couldn't find a TreeDataCallbackHook or context to use.`)
  return ctx.treeDataCallbackHook(fn, path, depth)
}

export const useNodeConfigs:NodeConfigsHook = (path) => {
  const ctx = useContext(Context)
  if (!ctx || !ctx.nodeConfigsHook) throw new Error(`Couldn't find a NodeConfigsHook or context to use.`)
  return ctx.nodeConfigsHook(path)
}

export default function StateProvider(
  {
    treeDataInitialiserHook,
    nodeDataHook,
    treeDataHook,
    treeDataCallbackHook,
    nodeConfigsHook,
    children
  }: DataProviderProps
) {
  return (
    <Context.Provider value={{
      treeDataInitialiserHook,
      nodeDataHook,
      treeDataCallbackHook,
      treeDataHook,
      nodeConfigsHook,
    }}>
      {children}
    </Context.Provider>
  );
}