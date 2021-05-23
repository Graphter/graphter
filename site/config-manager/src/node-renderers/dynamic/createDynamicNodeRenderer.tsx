import React, { ComponentType, useEffect, useState } from "react";
import { NodeConfig, NodeRendererProps, NodeRendererRegistration } from "@graphter/core";
import { pathUtils } from "@graphter/renderer-react";
import { setupNodeRenderer } from "@graphter/renderer-react";
import { isDynamicConfig } from "./isDynamicConfig";
import { nodeRendererStore, useTreeDataInitialiser } from "@graphter/renderer-react";
import { serviceStore } from "@graphter/renderer-react";
import { useTreeData } from "@graphter/renderer-react";
import { useDownstreamNodeConfigs } from "@graphter/renderer-react";

const createDynamicNodeRenderer = (configServiceId: string) => {
  const configService = serviceStore.get(configServiceId)

  const dynamicNodeRenderer: ComponentType<NodeRendererProps> = setupNodeRenderer((
    {
      config,
      originalTreeData,
      path,
      ErrorDisplayComponent
    }: NodeRendererProps
  ) => {
    if(!isDynamicConfig(config)) throw new Error('Invalid DynamicConfigNodeRenderer config')
    const pathValidation = pathUtils.validate(config.options.siblingPath)
    if(!pathValidation.valid) throw new Error(`Invalid local target path: ${pathValidation.reason}`)

    const targetPath = [...path.slice(0, -1), ...config.options.siblingPath]

    const targetNodeData = useTreeData<any>(targetPath)
    const targetNodeDataType = typeof targetNodeData
    if(!['undefined', 'string', 'number'].includes(targetNodeDataType) && targetNodeData !== null){
      throw new Error(`RendererOptionsNodeRenderer target data type '${targetNodeDataType}' is unsupported`)
    }

    const {
      downstreamConfigs,
      setDownstreamConfig,
      removeDownstreamConfig
    } = useDownstreamNodeConfigs(path, config)

    useEffect(() => {
      (async () => {
        if(targetNodeDataType === 'undefined' || targetNodeData === null) return
        const getConfigResult = await configService.get(targetNodeData)
        if(!getConfigResult.item) {
          removeDownstreamConfig()
          return
        }
        setDownstreamConfig(getConfigResult.item)
      })()
    }, [ targetNodeData ])

    if(!downstreamConfigs?.length) return (
      <div className='text-center p-10 text-gray-300'>N/A</div>
    )

    const childConfig = downstreamConfigs[0]
    const rendererRegistration = nodeRendererStore.get(childConfig.type)

    return (
      <>
        <rendererRegistration.Renderer
          config={childConfig}
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