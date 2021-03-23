import React, { ComponentType, useState } from 'react'
import {
  ErrorRendererProps,
  NodeConfig,
  NodeRendererProps,
  NodeRendererRegistration,
  PathSegment
} from "@graphter/core";
import { nodeRendererStore, createDefault } from "@graphter/renderer-react";
import { setupNodeRenderer } from "@graphter/renderer-react";
import DefaultItemView from "./DefaultItemView";
import DefaultNewItemWrapper from "./DefaultNewItemWrapper";
import DefaultEditItemWrapper from "./DefaultEditItemWrapper";
import { pathUtils } from "@graphter/renderer-react";
import { useTreeDataInitialiser } from "@graphter/renderer-react";
import { isListConfig } from "./isListConfig";
import { nanoid } from 'nanoid'
import { useNodeData } from "@graphter/renderer-react";

export interface ItemMeta {
  item: any
  key: string
  committed: boolean
  deleted: boolean
}

const ListNodeRenderer: ComponentType<NodeRendererProps> = setupNodeRenderer((
  {
    config,
    originalTreeData,
    globalPath,
    ErrorDisplayComponent,
    options
  }: NodeRendererProps
) => {
  if (!isListConfig(config)) throw new Error('Invalid config')
  const originalNodeData = pathUtils.getValue(originalTreeData, globalPath.slice(2), createDefault(config, []))
  if (!Array.isArray(originalNodeData)) throw new Error(`'${config.type}' renderer only works with arrays but got '${typeof originalNodeData}'`)

  const [ showNewItemUI, setShowNewItemUI ] = useState(false)
  const [ editingItems ] = useState<Set<string>>(new Set())

  const childConfig = config.children[0]
  const childRendererRegistration = nodeRendererStore.get(childConfig.type)
  if (!childRendererRegistration) throw new Error(`Couldn't find a renderer for child renderer type ${childConfig.type} at ${globalPath.join('/')}/${childConfig.id}`)

  const treeDataInitialiser = useTreeDataInitialiser()

  const [ itemsMeta, setItemsMeta ] = useNodeData<Array<ItemMeta>>(globalPath)

  function removeItem(key: string) {
    setItemsMeta([ ...itemsMeta.map(itemMeta => {
      if(itemMeta.key === key) return {
        ...itemMeta,
        deleted: true
      }
      return itemMeta
    })])
  }
  function commitItem(key: string) {
    setItemsMeta([ ...itemsMeta.map(itemMeta => {
      if(itemMeta.key === key) return {
        ...itemMeta,
        committed: true
      }
      return itemMeta
    })])
  }

  return (
    <div className='flex flex-col' data-nodetype='list' data-nodepath={globalPath.join('/')}>
      <div className='' data-testid='items'>
        {itemsMeta && itemsMeta.map((itemMeta: ItemMeta, i: number) => {
          if(itemMeta.deleted) return null
          const childPath = [ ...globalPath, i ]

          function setEditMode(key: string, editMode: boolean) {
            editMode ? editingItems.add(key) : editingItems.delete(key)
          }

          if (itemMeta.committed) {
            return renderCommittedItem(
              config,
              options,
              childConfig,
              childPath,
              childRendererRegistration,
              editingItems.has(itemMeta.key),
              setEditMode,
              itemMeta,
              removeItem,
              originalTreeData,
              ErrorDisplayComponent)
          } else {
            return renderUncommittedItem(
              config,
              childConfig,
              childPath,
              childRendererRegistration,
              itemMeta,
              commitItem,
              removeItem,
              originalTreeData,
              ErrorDisplayComponent)
          }
        })}
      </div>
      {!showNewItemUI && (
        (!config.options.maxItems || itemsMeta.length < config.options.maxItems) && (
          <button
            type='button'
            className='p-5 border border-dashed rounded hover:border-blue-200 hover:bg-gray-50 transition-colours duration-200 text-blue-300'
            onClick={() => {
              const childPath = [ ...globalPath, itemsMeta.length ]
              const childFallbackValue = childRendererRegistration.createFallbackDefaultValue ?
                childRendererRegistration.createFallbackDefaultValue(childConfig, childPath, (path) => pathUtils.getValue(originalTreeData, path)) :
                null
              setItemsMeta([
                ...itemsMeta,
                {
                  item: createDefault(childConfig, childFallbackValue),
                  key: nanoid(),
                  committed: false,
                  deleted: false
                }
              ])
              treeDataInitialiser(childConfig, [ ...globalPath, itemsMeta.length ], originalTreeData)
              setShowNewItemUI(true)
            }}
            data-testid='add-item-btn'
          >[+]</button>
        )
      )}

    </div>
  )
})

function renderCommittedItem(
  parentConfig: NodeConfig,
  parentOptions: any,
  childConfig: NodeConfig,
  childPath: Array<PathSegment>,
  childRendererRegistration: NodeRendererRegistration,
  isEditing: boolean,
  setEditMode: (key: string, editMode: boolean) => void,
  itemMeta: ItemMeta,
  removeItem: (key: string) => void,
  originalTreeData: any,
  ErrorDisplayComponent?: ComponentType<ErrorRendererProps>
) {
  if (isEditing) {
    const ChildTypeRenderer = childRendererRegistration.Renderer
    return (
      <DefaultEditItemWrapper
        key={itemMeta.key}
        onRemove={() => {
          removeItem(itemMeta.key)
        }}
        onDone={() => {
          setEditMode(itemMeta.key, false)
        }}
      >
        <ChildTypeRenderer
          config={childConfig}
          globalPath={childPath}
          originalTreeData={originalTreeData}
          ErrorDisplayComponent={ErrorDisplayComponent}
          options={childRendererRegistration.options}
        />
      </DefaultEditItemWrapper>
    )
  }

  return (
    <DefaultItemView
      key={itemMeta.key}
      childId={itemMeta.key}
      config={childConfig}
      globalPath={childPath}
      onSelect={() => {
        if (parentConfig.options?.itemSelectionBehaviour === 'INLINE' || !parentConfig.options?.itemSelectionBehaviour) {
          setEditMode(itemMeta.key, true)
        } else if (parentConfig.options?.itemSelectionBehaviour === 'CUSTOM' && typeof parentOptions?.customItemSelectionBehaviour === 'function') {
          parentOptions.customItemSelectionBehaviour(parentConfig.options?.itemSelectionBehaviour, childConfig, childPath)
        }
      }}
      onRemove={() => {
        removeItem(itemMeta.key)
      }}
    />
  )
}

function renderUncommittedItem(
  parentConfig: NodeConfig,
  childConfig: NodeConfig,
  childPath: Array<PathSegment>,
  childRendererRegistration: NodeRendererRegistration,
  itemMeta: ItemMeta,
  commitItem: (key: string) => void,
  removeItem: (key: string) => void,
  originalTreeData: any,
  ErrorDisplayComponent?: ComponentType<ErrorRendererProps>
) {
  const ChildTypeRenderer = childRendererRegistration.Renderer
  return (
    <DefaultNewItemWrapper
      config={parentConfig}
      onAdd={() => {
        commitItem(itemMeta.key)
      }}
      onCancel={() => {
        removeItem(itemMeta.key)
      }}
    >
      <ChildTypeRenderer
        config={childConfig}
        globalPath={childPath}
        originalTreeData={originalTreeData}
        ErrorDisplayComponent={ErrorDisplayComponent}
        options={childRendererRegistration.options}
      />
    </DefaultNewItemWrapper>
  )
}

export default ListNodeRenderer