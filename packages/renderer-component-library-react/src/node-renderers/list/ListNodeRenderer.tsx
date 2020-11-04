import React from 'react'
import { NodeConfig, NodeRendererProps } from "@graphter/core";
import { nodeRendererStore, createDefault } from "@graphter/renderer-react";
import s from './ListNodeRenderer.pcss'
import { useArrayNodeData } from "@graphter/renderer-react";

export default function ListNodeRenderer(
  {
    config,
    originalNodeData,
    committed,
    path,
    ErrorDisplayComponent
  }: NodeRendererProps
) {
  if (!originalNodeData) originalNodeData = createDefault(config, [])
  if(!Array.isArray(originalNodeData)) throw new Error(`'${config.type}' renderer only works with arrays`)
  if (!config.children || !config.children.length) throw new Error(`'${config.type}' renderer must have at least one child config`)
  if (config.children.length > 1) throw new Error('Only one child list type is currently supported')

  const childConfig = config.children[0]
  const childRendererRegistration = nodeRendererStore.get(childConfig.type)
  if (!childRendererRegistration) return null
  const ChildTypeRenderer = childRendererRegistration.renderer

  const {
    childIds,
    removeItem,
    commitItem,
  } = useArrayNodeData(path, config, originalNodeData, committed)

  return (
    <div className={s.listNodeRenderer} data-nodetype='list' data-nodepath={path.join('/')}>
      <div className={s.items} data-testid='items'>
        {childIds && childIds.map((childId: any, i: number) => {
          return (
            <DefaultExistingItemWrapper key={childId} onRemove={() => {
              removeItem(i)
            }}>
              <ChildTypeRenderer
                path={[ ...path, i ]}
                committed={committed}
                originalNodeData={originalNodeData ? originalNodeData[i] : undefined}
                config={childConfig}
                ErrorDisplayComponent={ErrorDisplayComponent} />
            </DefaultExistingItemWrapper>
          )
        })}
      </div>
      <DefaultNewItemWrapper config={config} onAdd={() => {
        commitItem(childIds.length)
      }}>
        <ChildTypeRenderer
          path={[ ...path, childIds.length ]}
          committed={false}
          config={childConfig}
          ErrorDisplayComponent={ErrorDisplayComponent} />
      </DefaultNewItemWrapper>
    </div>
  )
}

interface DefaultExistingItemWrapperProps {
  onRemove: () => void
  children: any
}

function DefaultExistingItemWrapper(
  {
    onRemove,
    children
  }: DefaultExistingItemWrapperProps
) {
  return (
    <div className={s.defaultItemWrapper}>
      {children}
      <button type='button' className={s.button} onClick={onRemove}>Remove [-]</button>
    </div>
  )
}

interface DefaultNewItemWrapperProps {
  config: NodeConfig
  onAdd: () => void
  children: any
}

function DefaultNewItemWrapper(
  {
    config,
    onAdd,
    children
  }: DefaultNewItemWrapperProps
) {
  return (

    <div className={s.defaultNewItemWrapper} data-testid='add-item'>
      {children}
      <button type='button' className={s.button} onClick={onAdd}>Add [+]</button>
    </div>
  )
}