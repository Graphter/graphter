import { NodeConfig, NodeDataInitialiserFn, PathSegment } from "@graphter/core";
import { nanoid } from 'nanoid'
import { createDefault, pathUtils } from "@graphter/renderer-react";

export const listInitialiser: NodeDataInitialiserFn = async (
  originalTreeData,
  config,
  path
) => {
  const originalNodeData = pathUtils.getValueByGlobalPath(originalTreeData, path, createDefault(config, []))
  if(!Array.isArray(originalNodeData)) throw new Error('List initialiser received unexpected original data type')
  return originalNodeData.map(item => ({
    item,
    key: nanoid(),
    committed: true,
    deleted: false
  }))
}