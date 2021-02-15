import React, { ComponentType } from "react";
import { NodeConfig, NodeRendererProps } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";
import { createDefault, useNodeData } from "@graphter/renderer-react";
import s from './ObjectNodeRenderer.pcss'
import { setupNodeRenderer } from "@graphter/renderer-react";
import { pathUtils } from "@graphter/renderer-react";

const ObjectNodeRenderer: ComponentType<NodeRendererProps> = setupNodeRenderer((
  {
    config,
    originalTreeData,
    globalPath,
    committed,
    ErrorDisplayComponent
  }: NodeRendererProps
) => {
  return (
    <div className='flex flex-col' data-nodetype='object' data-nodepath={globalPath.join('/')}>
      {config.children && config.children.map((childConfig, i) => {
        const childRendererRegistration = nodeRendererStore.get(childConfig.type)
        if (!childRendererRegistration) return null
        const ChildTypeRenderer = childRendererRegistration.Renderer
        return (
          <DefaultPropertyWrapper config={childConfig} key={childConfig.id}>
            <ChildTypeRenderer
              committed={committed}
              config={childConfig}
              globalPath={[ ...globalPath, childConfig.id ]}
              originalTreeData={originalTreeData}
              options={childRendererRegistration.options}
              ErrorDisplayComponent={ErrorDisplayComponent} />
          </DefaultPropertyWrapper>
        )
      })}
    </div>
  );
})

export default ObjectNodeRenderer

interface DefaultPropertyWrapperProps {
  config: NodeConfig
  children: any
}

function DefaultPropertyWrapper(
  {
    config,
    children
  }: DefaultPropertyWrapperProps
) {
  return (

    <div className='flex flex-col mb-5'>
      <label htmlFor={config.id}>{config.name}</label>
      {config.description && <p className='text-sm text-gray-400 mb-2'>{config.description}</p>}
      {children}
    </div>
  )
}