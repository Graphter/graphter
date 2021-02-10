import s from "./ListNodeRenderer.pcss";
import React from "react";

interface DefaultExistingItemWrapperEditProps {
  onRemove: () => void
  onDone?: () => void
  children: any
}

const DefaultEditItemWrapper = (
  {
    onRemove,
    onDone,
    children
  }: DefaultExistingItemWrapperEditProps
) => {
  return (
    <div className={s.defaultItemWrapper} data-testid='item'>
      {children}
      <button
        type='button'
        className={s.button}
        onClick={onRemove}
        data-testid='remove-item-btn'
      >Remove [-]</button>
      <button
        type='button'
        className={s.button}
        onClick={() => onDone && onDone()}
      >Done</button>
    </div>
  )
}

export default DefaultEditItemWrapper