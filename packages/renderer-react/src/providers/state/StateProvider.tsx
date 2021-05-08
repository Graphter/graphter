import React, { createContext, useContext } from 'react';
import { NodeConfig, PathSegment } from "@graphter/core";
import { NodeDataHook } from "./NodeDataHook";
import { TreeDataHook } from "./TreeDataHook";
import { TreeDataInitialiserHook } from "./TreeDataInitialiserHook";
import { TreeDataCallbackHook } from "./TreeDataCallbackHook";
import { NodeConfigsHook } from "./NodeConfigsHook";
import { ChildPathsHook } from "./ChildPathsHook";

interface DataProviderProps {
  treeDataInitialiserHook: TreeDataInitialiserHook
  nodeDataHook: NodeDataHook
  treeDataHook: TreeDataHook
  treeDataCallbackHook: TreeDataCallbackHook
  nodeConfigsHook: NodeConfigsHook
  childPathsHook: ChildPathsHook
  children: any
}

const Context = createContext<{
  treeDataInitialiserHook: TreeDataInitialiserHook
  nodeDataHook: NodeDataHook
  treeDataHook: TreeDataHook
  treeDataCallbackHook: TreeDataCallbackHook
  nodeConfigsHook: NodeConfigsHook
  childPathsHook: ChildPathsHook
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
  fn,
  path,
  depth) =>
{
  const ctx = useContext(Context)
  if (!ctx || !ctx.treeDataCallbackHook) throw new Error(`Couldn't find a TreeDataCallbackHook or context to use.`)
  return ctx.treeDataCallbackHook(fn, path, depth)
}

export const useNodeConfigs:NodeConfigsHook = (path) => {
  const ctx = useContext(Context)
  if (!ctx || !ctx.nodeConfigsHook) throw new Error(`Couldn't find a NodeConfigsHook or context to use.`)
  return ctx.nodeConfigsHook(path)
}

export const useChildPaths:ChildPathsHook = (path) => {
  const ctx = useContext(Context)
  if (!ctx || !ctx.nodeConfigsHook) throw new Error(`Couldn't find a ChildPathsHook or context to use.`)
  return ctx.childPathsHook(path)
}

export default function StateProvider(
  {
    treeDataInitialiserHook,
    nodeDataHook,
    treeDataHook,
    treeDataCallbackHook,
    nodeConfigsHook,
    childPathsHook,
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
      childPathsHook
    }}>
      {children}
    </Context.Provider>
  );
}