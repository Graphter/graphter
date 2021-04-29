import React, { createContext, useContext } from 'react';
import { NodeConfig, PathSegment } from "@graphter/core";
import { NodeDataHook } from "./NodeDataHook";
import { TreeDataHook } from "./TreeDataHook";
import { TreeDataInitialiserHook } from "./TreeDataInitialiserHook";
import { TreeDataCallbackHook } from "./TreeDataCallbackHook";
import { MultipleNodeDataHook } from "./MultipleNodeDataHook";
import { TreeMetaHook } from "./TreeMetaHook";
import { ExternalNodeDataHook } from "./ExternalNodeDataHook";
import { TreeMetaCallbackHook } from "./TreeMetaCallbackHook";

interface DataProviderProps {
  treeDataInitialiserHook: TreeDataInitialiserHook
  nodeDataHook: NodeDataHook
  externalNodeDataHook: ExternalNodeDataHook
  multipleNodeDataHook: MultipleNodeDataHook
  treeDataHook: TreeDataHook
  treeDataCallbackHook: TreeDataCallbackHook
  treeMetaHook: TreeMetaHook
  treeMetaCallbackHook: TreeMetaCallbackHook
  children: any
}

const Context = createContext<{
  treeDataInitialiserHook: TreeDataInitialiserHook
  nodeDataHook: NodeDataHook
  externalNodeDataHook: ExternalNodeDataHook
  multipleNodeDataHook: MultipleNodeDataHook
  treeDataHook: TreeDataHook
  treeDataCallbackHook: TreeDataCallbackHook
  treeMetaHook: TreeMetaHook
  treeMetaCallbackHook: TreeMetaCallbackHook
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
  return ctx.nodeDataHook(path, config, originalTreeData)
}

export function useExternalNodeData<D>(
  path: Array<PathSegment>
): [D, (nodeData: D) => void] {
  const ctx = useContext(Context)
  if (!ctx || !ctx.externalNodeDataHook) throw new Error(`Couldn't find a ExternalNodeDataHook or context to use.`)
  return ctx.externalNodeDataHook(path)
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
  depth?: number) =>
{
  const ctx = useContext(Context)
  if (!ctx || !ctx.treeDataHook) throw new Error(`Couldn't find a TreeDataCallbackHook or context to use.`)
  return ctx.treeDataCallbackHook(fn, config, path, depth)
}

export const useTreeMeta:TreeMetaHook = (config, path) => {
  const ctx = useContext(Context)
  if (!ctx || !ctx.treeMetaHook) throw new Error(`Couldn't find a TreeMetaHook or context to use.`)
  return ctx.treeMetaHook(config, path)
}

export const useTreeMetaCallback:TreeMetaCallbackHook = (
  fn: (data: any) => void,
  config,
  path: Array<PathSegment>,
  depth?: number) =>
{
  const ctx = useContext(Context)
  if (!ctx || !ctx.treeMetaCallbackHook) throw new Error(`Couldn't find a TreeMetaCallbackHook or context to use.`)
  return ctx.treeMetaCallbackHook(fn, config, path, depth)
}

export default function StateProvider(
  {
    treeDataInitialiserHook,
    nodeDataHook,
    externalNodeDataHook,
    multipleNodeDataHook,
    treeDataHook,
    treeDataCallbackHook,
    treeMetaHook,
    treeMetaCallbackHook,
    children
  }: DataProviderProps
) {
  return (
    <Context.Provider value={{
      treeDataInitialiserHook,
      nodeDataHook,
      externalNodeDataHook,
      multipleNodeDataHook,
      treeDataCallbackHook,
      treeDataHook,
      treeMetaHook,
      treeMetaCallbackHook,
    }}>
      {children}
    </Context.Provider>
  );
}