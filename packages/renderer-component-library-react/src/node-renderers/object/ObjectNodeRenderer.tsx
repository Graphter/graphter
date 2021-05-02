import React, { ComponentType } from "react";
import { NodeConfig, NodeRendererProps } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";
import { createDefault, useNodeData } from "@graphter/renderer-react";
import s from './ObjectNodeRenderer.pcss'
import { setupNodeRenderer } from "@graphter/renderer-react";
import { pathUtils } from "@graphter/renderer-react";
import cs from "classnames";

const ObjectNodeRenderer: ComponentType<NodeRendererProps> = setupNodeRenderer((
  {
    config,
    originalTreeData,
    path,
    ErrorDisplayComponent
  }: NodeRendererProps
) => {
  return (
    <div className='flex flex-col' data-nodetype='object' data-nodepath={path.join('/')}>
      {config.children && config.children.map((childConfig) => {
        const childRendererRegistration = nodeRendererStore.get(childConfig.type)
        if (!childRendererRegistration) return null
        const ChildTypeRenderer = childRendererRegistration.Renderer
        return (
          <DefaultPropertyWrapper config={childConfig} key={childConfig.id}>
            <ChildTypeRenderer
              config={childConfig}
              path={[ ...path, childConfig.id ]}
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
      <label htmlFor={config.id} className={cs({'mb-2': !config.description})}>{config.name}</label>
      {config.description && <p className='text-sm text-gray-400 mb-2'>{config.description}</p>}
      {children}
    </div>
  )
}