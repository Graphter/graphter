import React, { ComponentType } from "react";
import { NodeConfig, NodeRendererProps } from "@graphter/core";
import { nodeRendererStore } from "@graphter/renderer-react";
import { createDefault, useNodeData } from "@graphter/renderer-react";
import s from './ObjectNodeRenderer.pcss'
import { setupNodeRenderer } from "@graphter/renderer-react";

const ObjectNodeRenderer: ComponentType<NodeRendererProps> = setupNodeRenderer((
  {
    config,
    configAncestry,
    originalNodeData,
    originalNodeDataAncestry,
    path,
    committed,
    ErrorDisplayComponent
  }: NodeRendererProps
) => {
  if (!originalNodeData) originalNodeData = createDefault(config, {})
  useNodeData(path, config, originalNodeData, committed)
  const newConfigAncestry = [ ...configAncestry, config ]
  const newOriginalDataAncestry = [ ...originalNodeDataAncestry, originalNodeData ]
  return (
    <div className={s.objectNodeRenderer} data-nodetype='object' data-nodepath={path.join('/')}>
      {config.children && config.children.map((childConfig, i) => {
        const childRendererRegistration = nodeRendererStore.get(childConfig.type)
        if (!childRendererRegistration) return null
        const ChildTypeRenderer = childRendererRegistration.Renderer
        return (
          <DefaultPropertyWrapper config={childConfig} key={childConfig.id}>
            <ChildTypeRenderer
              committed={committed}
              config={childConfig}
              configAncestry={newConfigAncestry}
              path={[ ...path, childConfig.id ]}
              originalNodeData={originalNodeData[childConfig.id]}
              originalNodeDataAncestry={newOriginalDataAncestry}
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

    <div className={s.defaultWrapper}>
      <label htmlFor={config.id}>{config.name}</label>
      {config.description && <p className={s.description}>{config.description}</p>}
      {children}
    </div>
  )
}