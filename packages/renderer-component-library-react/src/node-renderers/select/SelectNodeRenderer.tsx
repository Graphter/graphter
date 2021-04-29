import React, { ComponentType, useState } from "react";
import { NodeRendererProps } from "@graphter/core";
import { useNodeData } from "@graphter/renderer-react";
import { setupNodeRenderer } from "@graphter/renderer-react";
import InlineValidation from "../../inline-validation";
import { isSelectNodeConfig } from "./isSelectNodeConfig";

const SelectNodeRenderer: ComponentType<NodeRendererProps> = setupNodeRenderer((
  {
    config,
    path,
    originalTreeData
  }: NodeRendererProps
) => {
  if(!isSelectNodeConfig(config)) throw new Error('Invalid SelectNodeRenderer config')
  const [ touched, setTouched ] = useState(false)
  const [ nodeData, setNodeData ] = useNodeData<string>(path, config, originalTreeData)
  return (
    <>
      <select
        onChange={(e) => {
          const value = e.currentTarget.value
          if(value !== 'loading'){
            setNodeData && setNodeData(value)
            setTouched(true)
          }
        }}
        value={nodeData}
        className='flex-grow p-3 rounded'
      >
        {Object.entries(config.options.options).map(([key, value]) => {
          return (
            <option key={key} value={key}>{value}</option>
          )
        })}
      </select>
      <InlineValidation
        touched={touched}
        nodeData={nodeData} />
    </>
  )
})

export default SelectNodeRenderer