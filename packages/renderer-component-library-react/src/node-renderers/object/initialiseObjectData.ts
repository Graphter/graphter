import { InitialiseNodeDataFn } from "@graphter/core";
import { createDefault, nodeRendererStore } from "@graphter/renderer-react";
import { pathUtils } from "@graphter/renderer-react";

export const initialiseObjectData:InitialiseNodeDataFn = (config, path, initialise, originalTreeData) => {
  const localPath = path.slice(2)
  const originalData = pathUtils.getValue(originalTreeData, localPath, createDefault(config, {}))
  initialise(path, originalData)
  config.children?.forEach(childConfig => {
    const childRenderer = nodeRendererStore.get(childConfig.type)
    const childPath = [ ...path, childConfig.id ]
    childRenderer.initialiseData(childConfig, childPath, initialise, originalTreeData)
  })
}