import React, { ComponentType, useEffect, useState } from "react";
import { NodeRendererProps } from "@graphter/core";
import { createDefault, useNodeData, useNodeValidation } from "@graphter/renderer-react";
import s from './IdNodeRenderer.module.css'
import { nanoid } from 'nanoid'
import { setupNodeRenderer } from "@graphter/renderer-react";

const filterRegExp = /[^a-z0-9-]/
const filterRegExpGlobal = /[^a-z0-9-]/g

const IdNodeRenderer: ComponentType<NodeRendererProps> = setupNodeRenderer((
  {
    config,
    originalNodeData,
    committed = true,
    path
  }: NodeRendererProps
) => {
  const isNew = typeof originalNodeData === 'undefined'
  if(isNew) originalNodeData = createDefault(config, '')
  const [ touched, setTouched ] = useState(false)
  const [ nodeData, setNodeData ] = useNodeData(path, config, originalNodeData, committed)
  const validationResults = useNodeValidation(path)
  const showFixButton = filterRegExp.test(nodeData)
  return (
    <>
      <input
        type='text'
        value={nodeData}
        data-nodetype='id'
        data-nodepath={path.join('/')}
        className={s.input}
        onChange={(e) => {
          if(!touched) setTouched(true)
          setNodeData && setNodeData(e.currentTarget.value);
        }} />
      {touched && (
        showFixButton ? (
          <button
            type='button'
            onClick={() => {
              setNodeData(nodeData.toLowerCase().replace(filterRegExpGlobal, '-'))
            }}
          >Fix</button>
        ) : (
          <span>Ok</span>
        )
      )}
      {touched &&
      validationResults.results.map((result, i) => (
        result.valid ? null : (
          <div className={s.error} key={i} data-testid='validation-error'>
            {result.errorMessage}
          </div>
        )
      ))}
    </>
  )
})

export default IdNodeRenderer