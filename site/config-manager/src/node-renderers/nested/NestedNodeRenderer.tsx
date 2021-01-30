import React, { ComponentType } from "react";
import { NodeRendererProps } from "@graphter/core";

import { nodeRendererStore } from "@graphter/renderer-react";
import { setupNodeRenderer } from "@graphter/renderer-react";
import { getConfig } from "@graphter/renderer-react";
import { useNodeData } from "@graphter/renderer-react";

const NestedNodeRenderer: ComponentType<NodeRendererProps> = setupNodeRenderer((
  {
    config,
    originalNodeData,
    committed = true,
    path,
    ErrorDisplayComponent,
  }: NodeRendererProps
) => {
  if (config.children?.length) throw new Error(`${config.type} type '${config.id}' cannot have children but one or more was defined`)
  if(!config.options?.configId) throw new Error(`${config.type} type '${config.id}' must have a configId defined`)
  const [ targetNodeData ] = useNodeData(path, config, originalNodeData, committed)
  const nestedConfig = getConfig(config.options?.configId)
  const nestedRendererRegistration = nodeRendererStore.get(nestedConfig.type)
  return (
    <>
      <nestedRendererRegistration.Renderer
        committed={committed}
        config={nestedConfig}
        path={[ ...path, nestedConfig.id ]}
        originalNodeData={originalNodeData}
        options={nestedRendererRegistration.options}
        ErrorDisplayComponent={ErrorDisplayComponent} />
    </>
  )
})

export default NestedNodeRenderer