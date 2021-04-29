import React, { ComponentType, useState } from "react";
import { NodeRendererProps } from "@graphter/core";
import { useNodeData } from "@graphter/renderer-react";
import { setupNodeRenderer } from "@graphter/renderer-react";
import InlineValidation from "../../inline-validation";

const NumberNodeRenderer: ComponentType<NodeRendererProps> = setupNodeRenderer((
  {
    config,
    path,
    originalTreeData
  }: NodeRendererProps
) => {
  const [ touched, setTouched ] = useState(false)
  const [ nodeData, setNodeData ] = useNodeData<number | undefined>(path, config, originalTreeData)
  return (
    <>
      <input
        type='number'
        value={nodeData}
        data-nodetype='string'
        data-nodepath={path.join('/')}
        className='flex-grow p-3 rounded'
        onChange={(e) => {
          if(!touched) setTouched(true)
          const numberValue = parseInt(e.currentTarget.value)
          setNodeData && setNodeData(isNaN(numberValue) ? undefined : numberValue);
        }} />
      <InlineValidation
        touched={touched}
        nodeData={nodeData} />
    </>
  )
})

export default NumberNodeRenderer