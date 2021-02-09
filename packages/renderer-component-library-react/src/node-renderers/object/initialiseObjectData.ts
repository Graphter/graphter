import { InitialiseNodeDataFn } from "@graphter/core";
import { createDefault, nodeRendererStore } from "@graphter/renderer-react";
import { pathUtils } from "@graphter/renderer-react";

export const initialiseObjectData:InitialiseNodeDataFn = (config, path, originalTreeData, initialise) => {
  const localPath = path.slice(2)
  const originalData = pathUtils.getValue(originalTreeData, localPath, createDefault(config, {}))
  initialise(path, originalData)
  config.children?.forEach(childConfig => {
    const childRenderer = nodeRendererStore.get(childConfig.type)
    const childPath = [ ...path, childConfig.id ]
    if(childRenderer.initialiseData)
      childRenderer.initialiseData(childConfig, childPath, originalTreeData, initialise)
    else initialise(childPath, originalData[childConfig.id])
  })
}