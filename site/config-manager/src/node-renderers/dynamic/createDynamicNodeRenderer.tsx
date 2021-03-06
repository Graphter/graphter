import React, { ComponentType, useEffect, useState } from "react";
import { NodeConfig, NodeRendererProps, NodeRendererRegistration } from "@graphter/core";
import { useNodeData } from "@graphter/renderer-react";
import { pathUtils } from "@graphter/renderer-react";
import { setupNodeRenderer } from "@graphter/renderer-react";
import { isDynamicConfig } from "./isDynamicConfig";
import { nodeRendererStore, useTreeDataInitialiser } from "@graphter/renderer-react";
import { serviceStore } from "@graphter/renderer-react";

const createDynamicNodeRenderer = (configServiceId: string) => {
  const configService = serviceStore.get(configServiceId)

  const dynamicNodeRenderer: ComponentType<NodeRendererProps> = setupNodeRenderer((
    {
      config,
      configAncestry,
      originalTreeData,
      path,
      ErrorDisplayComponent
    }: NodeRendererProps
  ) => {
    if(!isDynamicConfig(config)) throw new Error('Invalid DynamicConfigNodeRenderer config')
    const pathValidation = pathUtils.validate(config.options.siblingPath)
    if(!pathValidation.valid) throw new Error(`Invalid local target path: ${pathValidation.reason}`)

    const targetPath = [...path.slice(0, -1), ...config.options.siblingPath]
    const treeDataInitialiser = useTreeDataInitialiser()

    const [ targetNodeData ] = useNodeData<any>(targetPath)
    const targetNodeDataType = typeof targetNodeData
    if(!['undefined', 'string', 'number'].includes(targetNodeDataType) && targetNodeData !== null){
      throw new Error(`RendererOptionsNodeRenderer target data type '${targetNodeDataType}' is unsupported`)
    }

    const [ childConfig, setChildConfig ] = useState<NodeConfig | null>(null)
    const [ rendererRegistration, setRendererRegistration ] = useState<NodeRendererRegistration | null>(null)

    useEffect(() => {
      (async () => {
        if(targetNodeDataType === 'undefined' || targetNodeData === null) return
        const getConfigResult = await configService.get(targetNodeData)
        if(!getConfigResult.item) return
        setChildConfig(getConfigResult.item)
        const rendererRegistration = nodeRendererStore.get(getConfigResult.item.type)
        if(!rendererRegistration) return
        await treeDataInitialiser(getConfigResult.item, path, originalTreeData)
        setRendererRegistration(rendererRegistration)
      })()
    }, [ targetNodeData ])

    if(!childConfig || ! rendererRegistration) return (
      <div className='text-center p-10 text-gray-300'>N/A</div>
    )

    return (
      <>
        <rendererRegistration.Renderer
          config={childConfig}
          configAncestry={[...configAncestry, config]}
          path={[ ...path ]}
          originalTreeData={originalTreeData}
          options={rendererRegistration.options}
          ErrorDisplayComponent={ErrorDisplayComponent} />
      </>
    )
  })
  return dynamicNodeRenderer
}

export default createDynamicNodeRenderer