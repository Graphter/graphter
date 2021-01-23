import React, { useMemo } from "react";
import { NodeConfig, NodeRendererProps, NodeRendererRegistration } from "@graphter/core";
import { useNodeData } from "@graphter/renderer-react";
import { pathUtils } from "@graphter/renderer-react";
import stringify from 'fast-json-stable-stringify'
import { nodeRendererStore } from "@graphter/renderer-react";

interface Branch {
  condition: string | ((data: any) => boolean)
  childId: string
}

function ConditionalNodeRenderer(
  {
    config,
    originalNodeData,
    committed = true,
    path,
    ErrorDisplayComponent,
  }: NodeRendererProps
){
  if(!Array.isArray((config.options?.branches))) throw new Error('Conditional renderers need branch options')
  if(!config.children?.length) throw new Error('At least one child config is required')
  const pathValidation = pathUtils.validate(config.options.localTargetPath)
  if(!pathValidation.valid) throw new Error(`Invalid local target path: ${pathValidation.reason}`)

  const targetPath = [path[0], path[1], ...config.options.localTargetPath]
  const [ targetNodeData ] = useNodeData(targetPath, config, originalNodeData, committed)
  const match = useMemo<[NodeConfig, NodeRendererRegistration] | null>(() => {
    const matchingBranch = config.options.branches.find((branch: Branch) => typeof branch.condition === 'function' ?
      branch.condition(targetNodeData) :
      stringify(targetNodeData) === stringify(branch.condition))
    if(!matchingBranch) return null
    const matchingChildConfig = config.children?.find(childConfig => childConfig.id === matchingBranch.childId)
    if(!matchingChildConfig) throw new Error(`Matching branch child ID '${matchingBranch.childId}' does not match a child config`)
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
        path={path}
        originalNodeData={originalNodeData}
        options={matchingChildRendererRegistration.options}
        ErrorDisplayComponent={ErrorDisplayComponent} />
    </>
  )
}

export default ConditionalNodeRenderer