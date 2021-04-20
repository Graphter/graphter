import { useState, useEffect } from 'react';
import { NodeConfig, PathSegment } from "@graphter/core";
import { useTreeDataCallback } from "../../providers/state";

export const useTreeDataSnapshot = (config: NodeConfig, path: Array<PathSegment>) => {
  const [ treeData, setTreeData ] = useState<any>(null)
  const getTreeData = useTreeDataCallback(
    (treeData: any) => {
      setTreeData(treeData)
    },
    config,
    path.slice(0, 2))

  useEffect(() => {
    (async () => {
      await getTreeData()
    })()
  })

  return treeData
}