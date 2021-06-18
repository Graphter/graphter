import React, { ComponentType, Suspense, useEffect, useState } from 'react'
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
import { isListConfig } from "./isListConfig";
import { nanoid } from 'nanoid'
import { useNodeData } from "@graphter/renderer-react";
import { useTreeDataInitialiser } from "@graphter/renderer-react";
import { useChildPaths } from "@graphter/renderer-react";

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
    path,
    ErrorDisplayComponent,
    options
  }: NodeRendererProps
) => {
  if (!isListConfig(config)) throw new Error('Invalid config')
  const originalNodeData = pathUtils.getValueByGlobalPath(originalTreeData, path, createDefault(config, []))
  if (!Array.isArray(originalNodeData)) throw new Error(`'${config.type}' renderer only works with arrays but got '${typeof originalNodeData}'`)

  const [ editingItems ] = useState<Set<string>>(new Set())

  const childConfig = config.children[0]
  const childRendererRegistration = nodeRendererStore.get(childConfig.type)
  if (!childRendererRegistration) throw new Error(`Couldn't find a renderer for child renderer type ${childConfig.type} at ${path.join('/')}/${childConfig.id}`)

  const treeDataInitialiser = useTreeDataInitialiser()

  const [ itemsMeta, setItemsMeta ] = useNodeData<Array<ItemMeta>>(path, config, originalTreeData)

  const [ childPaths, setChildPaths ] = useChildPaths(path)

  useEffect(() => {
    if (!itemsMeta) {
      setItemsMeta([])
    }
  }, [ ])

  if (!itemsMeta) {
    return null
  }

  function removeItem(key: string) {
    setItemsMeta([ ...itemsMeta.map(itemMeta => {
      if (itemMeta.key === key) return {
        ...itemMeta,
        deleted: true
      }
      return itemMeta
    }) ])
  }

  function commitItem(key: string) {
    setItemsMeta([ ...itemsMeta.map(itemMeta => {
      if (itemMeta.key === key) return {
        ...itemMeta,
        committed: true
      }
      return itemMeta
    }) ])
  }

  return (
    <div className='flex flex-col' data-nodetype='list' data-nodepath={path.join('/')}>
      <div className='' data-testid='items'>
        {childPaths && childPaths.map((childPath, i: number) => {
          const itemMeta = itemsMeta[i]
          if (!itemMeta || itemMeta.deleted) return null

          function setEditMode(key: string, editMode: boolean) {
            editMode ? editingItems.add(key) : editingItems.delete(key)
          }

          if (itemMeta.committed) {
            return <CommittedItem
              key={itemMeta.key}
              parentConfig={config}
              parentOptions={options}
              childConfig={childConfig}
              childPath={childPath}
              childRendererRegistration={childRendererRegistration}
              isEditing={editingItems.has(itemMeta.key)}
              setEditMode={setEditMode}
              itemMeta={itemMeta}
              removeItem={removeItem}
              originalTreeData={originalTreeData}
              ErrorDisplayComponent={ErrorDisplayComponent}
            />
          } else {
            return <UncommittedItem
              key={itemMeta.key}
              parentConfig={config}
              childConfig={childConfig}
              childPath={childPath}
              childRendererRegistration={childRendererRegistration}
              itemMeta={itemMeta}
              commitItem={commitItem}
              removeItem={removeItem}
              originalTreeData={originalTreeData}
              ErrorDisplayComponent={ErrorDisplayComponent}
            />
          }
        })}
      </div>
      {(!config.options.maxItems || itemsMeta.length < config.options.maxItems) && (
        <button
          type='button'
          className='p-5 border border-dashed rounded hover:border-blue-200 hover:bg-gray-50 transition-colours duration-200 text-blue-300'
          onClick={() => {
            (async () => {
              await treeDataInitialiser(childConfig, [ ...path, itemsMeta.length ])
              const newChildPath = [ ...path, itemsMeta.length ]
              const childFallbackValue = childRendererRegistration.createFallbackDefaultValue ?
                childRendererRegistration.createFallbackDefaultValue(childConfig, newChildPath, (path) => pathUtils.getValueByGlobalPath(originalTreeData, path)) :
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
              setChildPaths([ ...childPaths, newChildPath ])
            })()
          }}
          data-testid='add-item-btn'
        >[+]</button>
      )}

    </div>
  )
})

function CommittedItem(
  {
    parentConfig,
    parentOptions,
    childConfig,
    childPath,
    childRendererRegistration,
    isEditing,
    setEditMode,
    itemMeta,
    removeItem,
    originalTreeData,
    ErrorDisplayComponent,
  }: {
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
  }) {
  if (isEditing) {
    const ChildTypeRenderer = childRendererRegistration.Renderer
    return (
      <DefaultEditItemWrapper
        onRemove={() => {
          removeItem(itemMeta.key)
        }}
        onDone={() => {
          setEditMode(itemMeta.key, false)
        }}
      >
        <ChildTypeRenderer
          config={childConfig}
          path={childPath}
          originalTreeData={originalTreeData}
          ErrorDisplayComponent={ErrorDisplayComponent}
          options={childRendererRegistration.options}
        />
      </DefaultEditItemWrapper>
    )
  }

  return (

    <Suspense key={itemMeta.key} fallback={<div>Loading...</div>}>
      <DefaultItemView
        childId={itemMeta.key}
        config={childConfig}
        path={childPath}
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
    </Suspense>
  )
}

function UncommittedItem(
  {
    parentConfig,
    childConfig,
    childPath,
    childRendererRegistration,
    itemMeta,
    commitItem,
    removeItem,
    originalTreeData,
    ErrorDisplayComponent,
  }: {
    parentConfig: NodeConfig,
    childConfig: NodeConfig,
    childPath: Array<PathSegment>,
    childRendererRegistration: NodeRendererRegistration,
    itemMeta: ItemMeta,
    commitItem: (key: string) => void,
    removeItem: (key: string) => void,
    originalTreeData: any,
    ErrorDisplayComponent?: ComponentType<ErrorRendererProps>,
  }
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
        path={childPath}
        originalTreeData={originalTreeData}
        ErrorDisplayComponent={ErrorDisplayComponent}
        options={childRendererRegistration.options}
      />
    </DefaultNewItemWrapper>
  )
}

export default ListNodeRenderer