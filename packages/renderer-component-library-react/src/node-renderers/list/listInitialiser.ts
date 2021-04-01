import { NodeConfig, NodeDataInitialiserFn, PathSegment } from "@graphter/core";
import { nanoid } from 'nanoid'
import { createDefault, getValue } from "@graphter/renderer-react";

export const listInitialiser: NodeDataInitialiserFn = (
  originalTreeData,
  config,
  path
) => {
  const originalNodeData = getValue(originalTreeData, path, createDefault(config, []))
  if(!Array.isArray(originalNodeData)) throw new Error('List initialiser received unexpected original data type')
  return originalNodeData.map(item => ({
    item,
    key: nanoid(),
    committed: true,
    deleted: false
  }))
}