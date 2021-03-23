import React, { ComponentType, useMemo } from "react";
import { NodeConfig, NodeRendererProps, NodeRendererRegistration } from "@graphter/core";
import { useNodeData } from "@graphter/renderer-react";
import { pathUtils } from "@graphter/renderer-react";
import { nodeRendererStore } from "@graphter/renderer-react";
import { getMatchingConfig } from "./getMatchingConfig";
import { setupNodeRenderer } from "@graphter/renderer-react";
import { isConditionalConfig } from "./isConditionalConfig";
import { useTreeDataInitialiser } from "@graphter/renderer-react";

const ConditionalNodeRenderer: ComponentType<NodeRendererProps> = setupNodeRenderer((
  {
    config,
    originalTreeData,
    globalPath,
    ErrorDisplayComponent,
  }: NodeRendererProps
) => {
  if(!Array.isArray((config.options?.branches))) throw new Error('Conditional renderers need branch options')
  if(!config.children?.length) throw new Error('At least one child config is required')
  const pathValidation = pathUtils.validate(config.options.siblingPath)
  if(!pathValidation.valid) throw new Error(`Invalid local target path: ${pathValidation.reason}`)

  const targetGlobalPath = [...globalPath.slice(0, -1), ...config.options.siblingPath]
  const treeDataInitialiser = useTreeDataInitialiser()

  const [ targetNodeData ] = useNodeData<any>(targetGlobalPath)
  if(!isConditionalConfig(config)) throw new Error()
  const match = useMemo<[NodeConfig, NodeRendererRegistration] | null>(() => {
    const matchingChildConfig = getMatchingConfig(config, targetNodeData)
    if(!matchingChildConfig) return null
    const rendererRegistration = nodeRendererStore.get(matchingChildConfig.type)
    if(!rendererRegistration) return null
    treeDataInitialiser(matchingChildConfig, globalPath, originalTreeData)
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
        globalPath={[ ...globalPath ]}
        originalTreeData={originalTreeData}
        options={matchingChildRendererRegistration.options}
        ErrorDisplayComponent={ErrorDisplayComponent} />
    </>
  )
})

export default ConditionalNodeRenderer