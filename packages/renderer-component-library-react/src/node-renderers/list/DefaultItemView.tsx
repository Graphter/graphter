import React from "react";
import { NodeConfig, PathSegment } from "@graphter/core";
import { useTreeData } from "@graphter/renderer-react";
import s from './DefaultItemView.pcss'
import dataDisplayUtils from "../../utils/dataDisplay";

interface DefaultItemViewProps {
  childId: string
  config: NodeConfig
  path: Array<PathSegment>
  options?: DefaultExistingItemViewOptions
  onSelect?: (childId: string) => void
  onRemove?: (childId: string) => void
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

const DefaultItemView = ({childId, config, path, options, onSelect, onRemove}: DefaultItemViewProps) => {
  const data = useTreeData(config, path)
  let significantData = dataDisplayUtils.extractSignificantData(data)
  return (
    <div className='flex flex-row'>
      <a
        className='flex-grow px-5 mb-2 rounded-lg shadow border border-gray-50 hover:border-blue-200 hover:bg-gray-50 cursor-pointer transition-colours duration-200'
        onClick={() => onSelect && onSelect(childId)}
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
      {onRemove && (
        <a
          onClick={() => onRemove(childId)}
          className='flex items-center px-5 mb-2 ml-2 rounded-lg shadow border border-gray-50 hover:border-red-200 hover:bg-red-50 cursor-pointer transition-colours duration-200'>
          <svg className='w-5 text-red-400' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </a>
      )}
    </div>
  )
}

export default DefaultItemView