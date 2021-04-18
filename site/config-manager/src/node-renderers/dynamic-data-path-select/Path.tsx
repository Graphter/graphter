import cs from "classnames";
import React from "react";
import { PathSegment } from "@graphter/core";
import { Fragment } from "react";

interface PathProps {
  path: Array<PathSegment>
  selected: boolean
  onClick?: (() => void) | null
}

const divider = <svg className='hidden sm:inline-block w-4 fill-current text-gray-200 mr-2'
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 20 20" fill="currentColor">
  <path fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
        clipRule="evenodd"/>
</svg>

const pathKeySalt = '46662294-54c3-4b4b-85e9-383d6a07274b'

const Path = ({ path, selected, onClick }: PathProps) => {
  const pathKey = path.join(pathKeySalt)
  const selectionEnabled = !!onClick
  return (
    <div
      className={cs(
        'flex rounded p-1 mb-1 overflow-auto border border-transparent',
        {
          'cursor-pointer': selectionEnabled,
          'hover:bg-gray-100': selectionEnabled,
          'hover:border-gray-100': selectionEnabled,
          'border': selected,
          'bg-gray-50': selected,
          'border-gray-100': selected
        })
      }
      key={pathKey}
      onClick={() => {
        onClick && onClick()
      }}
    >
      {path.map((segment, i) => {
        return (
          <Fragment key={i}>
            <span className='p-1 sm:p-2 border border-gray-200 bg-white mr-2 rounded text-gray-600'>{segment}</span>
            {i < path.length - 1 && divider}
          </Fragment>
        )
      })}
    </div>
  )
}

export default Path