import React, { ComponentType, useState } from "react";
import { NodeRendererProps } from "@graphter/core";
import { createDefault, useNodeData, useNodeValidation } from "@graphter/renderer-react";
import s from './StringNodeRenderer.pcss'
import { setupNodeRenderer } from "@graphter/renderer-react";
import { pathUtils } from "@graphter/renderer-react";

const StringNodeRenderer: ComponentType<NodeRendererProps> = setupNodeRenderer((
  {
    config,
    originalTreeData,
    committed = true,
    globalPath
  }: NodeRendererProps
) => {
  const originalNodeData = pathUtils.getValue(originalTreeData, globalPath.slice(2), createDefault(config, ''))
  const [ touched, setTouched ] = useState(false)
  const [ nodeData, setNodeData ] = useNodeData(globalPath, originalNodeData, committed)
  const validationResults = useNodeValidation(config, globalPath)
  return (
    <>
      <input
        type='text'
        value={nodeData}
        data-nodetype='string'
        data-nodepath={globalPath.join('/')}
        className={s.input}
        onChange={(e) => {
          if(!touched) setTouched(true)
          setNodeData && setNodeData(e.currentTarget.value);
        }} />
      {touched &&
      validationResults &&
      validationResults.value === nodeData &&
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

export default StringNodeRenderer