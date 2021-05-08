import React, { ComponentType, useMemo } from "react";
import { NodeConfig, NodeRendererProps, NodeRendererRegistration } from "@graphter/core";
import { pathUtils } from "@graphter/renderer-react";
import { nodeRendererStore } from "@graphter/renderer-react";
import { getMatchingConfig } from "./getMatchingConfig";
import { setupNodeRenderer } from "@graphter/renderer-react";
import { isConditionalConfig } from "./isConditionalConfig";
import { useTreeDataInitialiser } from "@graphter/renderer-react";
import { useTreeData } from "@graphter/renderer-react";

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
  const treeDataInitialiser = useTreeDataInitialiser()

  const targetNodeData = useTreeData<any>(targetPath)
  const match = useMemo<[NodeConfig, NodeRendererRegistration] | null>(() => {
    const matchingChildConfig = getMatchingConfig(config, targetNodeData)
    if(!matchingChildConfig) return null
    const rendererRegistration = nodeRendererStore.get(matchingChildConfig.type)
    if(!rendererRegistration) return null
    treeDataInitialiser(matchingChildConfig, path, originalTreeData)
    return [ matchingChildConfig, rendererRegistration ]
  }, [ targetNodeData ])


  if(!match) return (
    <div className='text-center p-10 text-gray-300'>N/A</div>
  )

  const [ matchingChildConfig, matchingChildRendererRegistration ] = match

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