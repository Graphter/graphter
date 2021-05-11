import React, { ComponentType, useEffect } from "react";
import { NodeRendererProps } from "@graphter/core";
import { pathUtils } from "@graphter/renderer-react";
import { nodeRendererStore } from "@graphter/renderer-react";
import { getMatchingConfig } from "./getMatchingConfig";
import { setupNodeRenderer } from "@graphter/renderer-react";
import { isConditionalConfig } from "./isConditionalConfig";
import { useTreeData } from "@graphter/renderer-react";
import { useDownstreamNodeConfigs } from "@graphter/renderer-react";
import { useChildPaths } from "@graphter/renderer-react";

const ConditionalNodeRenderer: ComponentType<NodeRendererProps> = setupNodeRenderer((
  {
    config,
    originalTreeData,
    path,
    ErrorDisplayComponent,
  }: NodeRendererProps
) => {
  if(!isConditionalConfig(config)) throw new Error('Invalid ConditionalNodeRenderer config')
  const pathValidation = pathUtils.validate(config.options.siblingPath)
  if(!pathValidation.valid) throw new Error(`Invalid local target path: ${pathValidation.reason}`)

  const targetPath = [...path.slice(0, -1), ...config.options.siblingPath]
  const targetNodeData = useTreeData<any>(targetPath)
  const {
    downstreamConfigs,
    setDownstreamConfig,
    removeDownstreamConfig
  } = useDownstreamNodeConfigs(path, config)
  const [ childPaths, setChildPaths ] = useChildPaths(path)

  useEffect(() => {
    const matchingChildConfig = getMatchingConfig(config, targetNodeData)
    if(matchingChildConfig){
      setDownstreamConfig(matchingChildConfig)
    } else {
      setChildPaths([])
      removeDownstreamConfig()
    }
  }, [ targetNodeData ])

  if(!downstreamConfigs?.length) return (
    <div className='text-center p-10 text-gray-300'>N/A</div>
  )

  const matchingChildConfig = downstreamConfigs[0]
  const matchingChildRendererRegistration = nodeRendererStore.get(matchingChildConfig.type)

  if(matchingChildConfig.id === config.id && matchingChildConfig.type === config.type){
    throw new Error(`Conditional appears to be rendering itself as a child at '${path.join('/')}'`)
  }

  return (
    <>
      <matchingChildRendererRegistration.Renderer
        config={matchingChildConfig}
        path={[ ...path ]}
        originalTreeData={originalTreeData}
        options={matchingChildRendererRegistration.options}
        ErrorDisplayComponent={ErrorDisplayComponent} />
    </>
  )
})

export default ConditionalNodeRenderer