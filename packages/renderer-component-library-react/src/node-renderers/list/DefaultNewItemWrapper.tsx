import s from "./ListNodeRenderer.pcss";
import React from "react";
import { NodeConfig } from "@graphter/core";

interface DefaultNewItemWrapperEditProps {
  config: NodeConfig
  onAdd: () => void
  onCancel: () => void
  children: any
}

const DefaultNewItemWrapper = (
  {
    config,
    onAdd,
    onCancel,
    children
  }: DefaultNewItemWrapperEditProps
) => {
  return (

    <div className='my-5 pl-3 border-l-4 border-blue-200' data-testid='add-item' data-component='DefaultNewItemWrapper'>
      <span className='text-lg mb-3'>Adding new item to {config.name}</span>
      {children}
      <div className='flex justify-between'>
        <button
          type='button'
          className='p-3 mr-2 bg-blue-300 text-white rounded'
          onClick={onAdd}
          data-testid='add-item-btn'
        >Add [+]</button>
        <button
          type='button'
          className='p-3 mr-2 text-red-500 rounded'
          onClick={() => onCancel && onCancel()}
        >Cancel</button>
      </div>
    </div>
  )
}

export default DefaultNewItemWrapper