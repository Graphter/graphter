import React, { ComponentType, useState } from "react";
import { NodeRendererProps } from "@graphter/core";
import { createDefault, useNodeData, useNodeValidation } from "@graphter/renderer-react";
import s from './IdNodeRenderer.module.css'
import { setupNodeRenderer } from "@graphter/renderer-react";
import { pathUtils } from "@graphter/renderer-react";
import { InlineValidation } from "@graphter/renderer-component-library-react";

const filterRegExp = /[^a-z0-9-]/
const filterRegExpGlobal = /[^a-z0-9-]/g

const IdNodeRenderer: ComponentType<NodeRendererProps> = setupNodeRenderer((
  {
    config,
    globalPath
  }: NodeRendererProps
) => {
  const [ touched, setTouched ] = useState(false)
  const [ nodeData, setNodeData ] = useNodeData<string>(globalPath)
  const validationResults = useNodeValidation(config, globalPath)
  const showFixButton = filterRegExp.test(nodeData)
  return (
    <>
      <div className='flex'>
      <input
        type='text'
        value={nodeData}
        data-nodetype='id'
        data-nodepath={globalPath.join('/')}
        className='flex-grow p-3 rounded'
        onChange={(e) => {
          if(!touched) setTouched(true)
          setNodeData && setNodeData(e.currentTarget.value);
        }} />
      {touched && (
        showFixButton && (
          <button
            type='button'
            className='flex-none p-3 rounded bg-green-500 text-white ml-3'
            onClick={() => {
              setNodeData(nodeData.toLowerCase().replace(filterRegExpGlobal, '-'))
            }}
          >Fix</button>
        )
      )}
      </div>
      <InlineValidation
        touched={touched}
        validationData={validationResults}
        nodeData={nodeData} />
    </>
  )
})

export default IdNodeRenderer