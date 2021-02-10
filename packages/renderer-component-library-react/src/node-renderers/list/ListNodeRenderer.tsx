import React, { ComponentType, useState } from 'react'
import { NodeRendererProps } from "@graphter/core";
import { nodeRendererStore, createDefault } from "@graphter/renderer-react";
import s from './ListNodeRenderer.pcss'
import { useArrayNodeData } from "@graphter/renderer-react";
import { setupNodeRenderer } from "@graphter/renderer-react";
import DefaultItemView from "./DefaultItemView";
import DefaultNewItemWrapper from "./DefaultNewItemWrapper";
import DefaultEditItemWrapper from "./DefaultEditItemWrapper";

const ListNodeRenderer: ComponentType<NodeRendererProps> = setupNodeRenderer((
  {
    config,
    configAncestry,
    originalNodeData,
    originalNodeDataAncestry,
    committed,
    path,
    ErrorDisplayComponent
  }: NodeRendererProps
) => {
  if(!config) throw new Error(`<ListNodeRenderer /> component at '${path.join('/')}' is missing config`)
  if (!originalNodeData) originalNodeData = createDefault(config, [])
  if(!Array.isArray(originalNodeData)) throw new Error(`'${config.type}' renderer only works with arrays but got '${typeof originalNodeData}'`)
  if (!config.children || !config.children.length) throw new Error(`'${config.type}' renderer must have at least one child config`)
  if (config.children.length > 1) throw new Error('Only one child list type is currently supported')

  const [ showNewItemUI, setShowNewItemUI ] = useState(false)
  const [ editingItems, setEditingItems ] = useState<Set<string>>(new Set())

  const childConfig = config.children[0]
  const childRendererRegistration = nodeRendererStore.get(childConfig.type)
  if (!childRendererRegistration) throw new Error(`Couldn't find a renderer for child renderer type ${childConfig.type} at ${path.join('/')}/${childConfig.id}`)
  const ChildTypeRenderer = childRendererRegistration.Renderer

  const newConfigAncestry = [ ...configAncestry, config ]
  const newOriginalDataAncestry = [ ...originalNodeDataAncestry, originalNodeData ]

  const {
    childIds,
    removeItem,
    commitItem,
  } = useArrayNodeData(path, config, originalNodeData, committed)

  return (
    <div className={s.listNodeRenderer} data-nodetype='list' data-nodepath={path.join('/')}>
      <label htmlFor={config.id}>{config.name}</label>
      {config.description && <p className={s.description}>{config.description}</p>}
      <div className={s.items} data-testid='items'>
        {childIds && childIds.map((childId: any, i: number) => {
          const childPath = [ ...path, i ]
          if(!editingItems.has(childId)) return (
            <DefaultItemView
              childId={childId}
              config={childConfig}
              path={childPath}
              onEdit={() => {
                const newEditingItems = new Set(editingItems)
                newEditingItems.add(childId)
                setEditingItems(newEditingItems)
              }}
            />
          )
          return (
            <DefaultEditItemWrapper
              key={childId}
              onRemove={() => {
                removeItem(i)
              }}
              onDone={() => {
                const newEditingItems = new Set(editingItems)
                newEditingItems.delete(childId)
                setEditingItems(newEditingItems)
              }}
            >
              <ChildTypeRenderer
                config={childConfig}
                configAncestry={newConfigAncestry}
                path={childPath}
                committed={committed}
                originalNodeData={originalNodeData ? originalNodeData[i] : undefined}
                originalNodeDataAncestry={newOriginalDataAncestry}
                ErrorDisplayComponent={ErrorDisplayComponent}
              />
            </DefaultEditItemWrapper>
          )
        })}
        {!childIds.length && (
          <div>
            Empty
          </div>
        )}
      </div>
      {showNewItemUI ? (
        <DefaultNewItemWrapper
          config={config}
          onAdd={() => {
            setShowNewItemUI(false)
            commitItem(childIds.length)
          }}
          onCancel={() => {
            setShowNewItemUI(false)
          }}
        >
          <ChildTypeRenderer
            config={childConfig}
            configAncestry={newConfigAncestry}
            path={[ ...path, childIds.length ]}
            committed={false}
            originalNodeDataAncestry={newOriginalDataAncestry}
            ErrorDisplayComponent={ErrorDisplayComponent} />
        </DefaultNewItemWrapper>
      ) : (
        <button
          type='button'
          className={s.button}
          onClick={() => setShowNewItemUI(true)}
          data-testid='add-item-btn'
        >[+]</button>
      )}

    </div>
  )
})

export default ListNodeRenderer