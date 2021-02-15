import { InitialiseNodeDataFn } from "@graphter/core";
import { createDefault, nodeRendererStore } from "@graphter/renderer-react";
import { pathUtils } from "@graphter/renderer-react";
import { nanoid } from "nanoid";

export const initialiseListData:InitialiseNodeDataFn = (config, path, initialise, originalTreeData) => {
  if(!config.children?.length) throw new Error('List renderer has incorrect number of child configs')
  const childConfig = config.children[0]
  const localPath = path.slice(2)
  const originalData = pathUtils.getValue(originalTreeData, localPath, createDefault(config, []))
  if(!Array.isArray(originalData)) return
  initialise(path, originalData.map(() => nanoid()))
  originalData.forEach((originalChildData, i) => {
    const childRenderer = nodeRendererStore.get(childConfig.type)
    const childPath = [ ...path, i ]
    childRenderer.initialiseData(childConfig, childPath, initialise, originalTreeData)
  })
}