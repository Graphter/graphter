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

    <div className={s.defaultNewItemWrapper} data-testid='add-item'>
      {children}
      <button
        type='button'
        className={s.button}
        onClick={onAdd}
        data-testid='add-item-btn'
      >Add [+]</button>
      <button
        type='button'
        className={s.button}
        onClick={() => onCancel && onCancel()}
      >Cancel</button>
    </div>
  )
}

export default DefaultNewItemWrapper