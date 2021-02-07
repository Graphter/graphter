import React, { ComponentType, useMemo } from "react";
import { NodeConfig, NodeRendererProps, NodeRendererRegistration, PathSegment } from "@graphter/core";
import { useNodeData } from "@graphter/renderer-react";
import { pathUtils } from "@graphter/renderer-react";
import { nodeRendererStore } from "@graphter/renderer-react";
import { getMatchingConfig } from "./getMatchingConfig";
import { setupNodeRenderer } from "@graphter/renderer-react";
import { getValue } from "@graphter/renderer-react";
import { configUtils } from "@graphter/renderer-react";

const NoMatch = 'no-match-4acbdcce-9225-4fee-b845-7159110763eb'

const ConditionalNodeRenderer: ComponentType<NodeRendererProps> = setupNodeRenderer((
  {
    config,
    configAncestry,
    originalNodeData,
    originalNodeDataAncestry,
    committed = true,
    path,
    ErrorDisplayComponent,
  }: NodeRendererProps
) => {
  if(!Array.isArray((config.options?.branches))) throw new Error('Conditional renderers need branch options')
  if(!config.children?.length) throw new Error('At least one child config is required')
  const pathValidation = pathUtils.validate(config.options.siblingPath)
  if(!pathValidation.valid) throw new Error(`Invalid local target path: ${pathValidation.reason}`)

  const targetPath = [...path.slice(0, -1), ...config.options.siblingPath]

  const parentConfig = configAncestry[configAncestry.length - 1]
  const targetConfig = configUtils.getAt(parentConfig, config.options.siblingPath)

  const parentData = originalNodeDataAncestry[originalNodeDataAncestry.length - 1]
  const targetData = getValue(parentData, config.options.siblingPath, NoMatch)

  const [ targetNodeData ] = useNodeData(targetPath, targetConfig, targetData, committed)
  const match = useMemo<[NodeConfig, NodeRendererRegistration] | null>(() => {
    const matchingChildConfig = getMatchingConfig(config, targetNodeData)
    if(!matchingChildConfig) return null
    const rendererRegistration = nodeRendererStore.get(matchingChildConfig.type)
    if(!rendererRegistration) return null
    return [ matchingChildConfig, rendererRegistration ]
  }, [ targetNodeData ])

  if(!match) return null

  const [ matchingChildConfig, matchingChildRendererRegistration ] = match

  return (
    <>
      <matchingChildRendererRegistration.Renderer
        committed={committed}
        config={matchingChildConfig}
        configAncestry={configAncestry}
        path={[ ...path ]}
        originalNodeData={originalNodeData}
        originalNodeDataAncestry={originalNodeDataAncestry}
        options={matchingChildRendererRegistration.options}
        ErrorDisplayComponent={ErrorDisplayComponent} />
    </>
  )
})

export default ConditionalNodeRenderer