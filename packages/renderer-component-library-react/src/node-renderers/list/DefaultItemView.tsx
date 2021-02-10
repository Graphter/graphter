import React from "react";
import { NodeConfig, PathSegment } from "@graphter/core";
import { useTreeData } from "@graphter/renderer-react";
import s from './DefaultItemView.pcss'

interface DefaultItemViewProps {
  childId: string
  config: NodeConfig
  path: Array<PathSegment>
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

const DefaultItemView = ({childId, config, path, options, onEdit}: DefaultItemViewProps) => {
  const data = useTreeData(config, path)
  const dataType = typeof data
  let contents = null
  if (dataType === 'undefined') contents = <div>Empty</div>
  else if (dataType === 'string' || dataType === 'number') contents = <div>{data}</div>
  else if (Array.isArray(data)) {
    contents = (
      <div>
        {data.map((item, i) =>
          <DefaultItemView
            key={i}
            childId={childId}
            config={item}
            path={path}
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
      <div className={s.name}>{name}</div>
      <div className={s.description}>{description}</div>
      {keyValues.map(({key, value}) => (
        <span key={key} className={s.keyValue}>
          <span className={s.key}>{key}</span>: <span className={s.value}>{value}</span>
        </span>))}
    </>
  }
  return (
    <a
      className={s.defaultListItem}
      onClick={() => onEdit && onEdit(childId)}
      data-testid='default-item-view'
    >
      {contents}
    </a>
  )
}

export default DefaultItemView