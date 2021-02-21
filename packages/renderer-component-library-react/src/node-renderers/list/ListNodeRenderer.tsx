import React, { ComponentType, useState } from 'react'
import { NodeRendererProps } from "@graphter/core";
import { nodeRendererStore, createDefault } from "@graphter/renderer-react";
import { useArrayNodeData } from "@graphter/renderer-react";
import { setupNodeRenderer } from "@graphter/renderer-react";
import DefaultItemView from "./DefaultItemView";
import DefaultNewItemWrapper from "./DefaultNewItemWrapper";
import DefaultEditItemWrapper from "./DefaultEditItemWrapper";
import { pathUtils } from "@graphter/renderer-react";
import { useTreeDataInitialiser } from "@graphter/renderer-react";

const ListNodeRenderer: ComponentType<NodeRendererProps> = setupNodeRenderer((
  {
    config,
    originalTreeData,
    committed,
    globalPath,
    ErrorDisplayComponent,
    options
  }: NodeRendererProps
) => {
  if (!config) throw new Error(`<ListNodeRenderer /> component at '${globalPath.join('/')}' is missing config`)
  const originalNodeData = pathUtils.getValue(originalTreeData, globalPath.slice(2), createDefault(config, []))
  if (!Array.isArray(originalNodeData)) throw new Error(`'${config.type}' renderer only works with arrays but got '${typeof originalNodeData}'`)
  if (!config.children || !config.children.length) throw new Error(`'${config.type}' renderer must have at least one child config`)
  if (config.children.length > 1) throw new Error('Only one child list type is currently supported')

  const [ showNewItemUI, setShowNewItemUI ] = useState(false)
  const [ editingItems, setEditingItems ] = useState<Set<string>>(new Set())

  const childConfig = config.children[0]
  const childRendererRegistration = nodeRendererStore.get(childConfig.type)
  if (!childRendererRegistration) throw new Error(`Couldn't find a renderer for child renderer type ${childConfig.type} at ${globalPath.join('/')}/${childConfig.id}`)
  const ChildTypeRenderer = childRendererRegistration.Renderer

  const treeDataInitialiser = useTreeDataInitialiser()

  const {
    childIds,
    removeItem,
    commitItem,
  } = useArrayNodeData(globalPath)

  return (
    <div className='flex flex-col' data-nodetype='list' data-nodepath={globalPath.join('/')}>
      <div className='' data-testid='items'>
        {childIds && childIds.map((childId: any, i: number) => {
          const childPath = [ ...globalPath, i ]
          if (!editingItems.has(childId)) return (
            <DefaultItemView
              key={childId}
              childId={childId}
              config={childConfig}
              globalPath={childPath}
              onSelect={() => {
                if (config.options?.itemSelectionBehaviour === 'INLINE' || !config.options?.itemSelectionBehaviour) {
                  const newEditingItems = new Set(editingItems)
                  newEditingItems.add(childId)
                  setEditingItems(newEditingItems)
                  return
                }
                if (config.options?.itemSelectionBehaviour === 'CUSTOM' && typeof options?.customItemSelectionBehaviour === 'function') {
                  options.customItemSelectionBehaviour(config.options?.itemSelectionBehaviour, childConfig, childPath)
                }
              }}
              onRemove={() => {
                removeItem(i)
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
                globalPath={childPath}
                committed={committed}
                originalTreeData={originalTreeData}
                ErrorDisplayComponent={ErrorDisplayComponent}
                options={childRendererRegistration.options}
              />
            </DefaultEditItemWrapper>
          )
        })}
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
            globalPath={[ ...globalPath, childIds.length ]}
            committed={false}
            originalTreeData={originalTreeData}
            ErrorDisplayComponent={ErrorDisplayComponent}
            options={childRendererRegistration.options}
          />
        </DefaultNewItemWrapper>
      ) : (
        <button
          type='button'
          className='p-5 border border-dashed rounded hover:border-blue-200 hover:bg-gray-50 transition-colours duration-200 text-blue-300'
          onClick={() => {
            treeDataInitialiser(childConfig, [ ...globalPath, childIds.length ], false)
            setShowNewItemUI(true)
          }}
          data-testid='add-item-btn'
        >[+]</button>
      )}

    </div>
  )
})

export default ListNodeRenderer