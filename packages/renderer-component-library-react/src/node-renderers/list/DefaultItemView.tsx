import React from "react";
import { NodeConfig, PathSegment } from "@graphter/core";
import { useTreeData } from "@graphter/renderer-react";
import s from './DefaultItemView.pcss'
import dataDisplayUtils from "../../utils/dataDisplay";

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

const DefaultItemView = ({childId, config, globalPath, options, onEdit}: DefaultItemViewProps) => {
  const data = useTreeData(config, globalPath)
  let significantData = dataDisplayUtils.extractSignificantData(data)
  return (
    <a
      className='block px-5 mb-2 rounded-lg shadow border border-gray-50 hover:border-blue-200 hover:bg-gray-50 cursor-pointer transition-colours duration-200'
      onClick={() => onEdit && onEdit(childId)}
      data-testid='default-item-view'
    >
      <div className='divide-y divide-gray-200'>
        <div className='py-5'>
          <div className='text-xl'>{significantData.name}</div>
          {significantData.description && <div className='text-sm text-gray-900'>{significantData.description}</div>}
        </div>
        {significantData.keyValues && <div className='py-3'>
          {significantData.keyValues?.map(({key, value}) => (
            <span key={key} className='inline-block px-2 py-1 text-sm bg-gray-100 rounded-3xl'>
              <span className='text-gray-300'>{key}:</span> <span className={s.value}>{value}</span>
            </span>))}
        </div>}
      </div>
    </a>
  )
}

export default DefaultItemView