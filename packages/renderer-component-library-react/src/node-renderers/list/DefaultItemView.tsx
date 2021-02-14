import React from "react";
import { NodeConfig, PathSegment } from "@graphter/core";
import { useTreeData } from "@graphter/renderer-react";
import s from './DefaultItemView.pcss'

interface DefaultItemViewProps {
  childId: string
  config: NodeConfig
  globalPath: Array<PathSegment>
  options?: DefaultExistingItemViewOptions
  onEdit?: (childId: string) => void
}

interface DefaultExistingItemViewOptions {
  namePaths?: Array<Array<PathSegment>>
  descriptionPaths?: Array<Array<PathSegment>>
  keyValues?: Array<KeyValueDefinition>
}

interface KeyValueDefinition {
  label: string
  valuePaths: Array<Array<PathSegment>>
}

const guessingNames = [ 'name', 'title', 'headline', 'label', 'id' ]
const guessingDescriptions = [ 'description', 'body', 'subtext', 'metadata' ]
const guessingIds = [ 'id', 'identifier', 'key' ]

const DefaultItemView = ({childId, config, globalPath, options, onEdit}: DefaultItemViewProps) => {
  const data = useTreeData(config, globalPath)
  const dataType = typeof data
  let contents = null
  if (dataType === 'undefined') contents = <div>Empty</div>
  else if (dataType === 'string' || dataType === 'number') contents = <div>{data}</div>
  else if (Array.isArray(data)) {
    contents = (
      <div className='py-3'>
        {data.map((item, i) =>
          <DefaultItemView
            key={i}
            childId={childId}
            config={item}
            globalPath={globalPath}
            options={options}
            onEdit={onEdit}/>
        )}
      </div>
    )
  }
  else {
    let name: string | undefined
    let description: string | undefined
    let keyValues: Array<{ key: string, value: string }> = []
    if (options) {

    } else {
      let dataEntries = new Map(
        Object.entries(data)
          .map(([ key, value ]) => [ key.toLowerCase(), value ])
      )
      guessingNames.some(nameGuess => {
        if (dataEntries.has(nameGuess)) {
          name = dataEntries.get(nameGuess)
          dataEntries.delete(nameGuess)
          return true
        }
        return false
      })
      guessingDescriptions.some(descriptionGuess => {
        if (dataEntries.has(descriptionGuess)) {
          description = dataEntries.get(descriptionGuess)
          dataEntries.delete(descriptionGuess)
          return true
        }
        return false
      })
      dataEntries.forEach((value, key) => {
        if (
          typeof value === 'string' &&
          guessingIds.indexOf(key) === -1 &&
          keyValues.length <= 10
        ) {
          keyValues.push({key, value})
        }
      })
    }
    contents = <>
      <div className='divide-y divide-gray-200'>
        <div className='py-5'>
          <div className='text-xl'>{name}</div>
          <div className='text-sm text-gray-900'>{description}</div>
        </div>
        <div className='py-3'>
          {keyValues.map(({key, value}) => (
            <span key={key} className='inline-block px-2 py-1 text-sm bg-gray-100 rounded-3xl'>
              <span className='text-gray-300'>{key}:</span> <span className={s.value}>{value}</span>
            </span>))}
        </div>
    </div>
    </>
  }
  return (
    <a
      className='block px-5 mb-2 rounded-lg shadow border border-gray-50 hover:border-blue-200 hover:bg-gray-50 cursor-pointer transition-colours duration-200'
      onClick={() => onEdit && onEdit(childId)}
      data-testid='default-item-view'
    >
      {contents}
    </a>
  )
}

export default DefaultItemView