import React, { ComponentType, useState } from "react";
import { NodeRendererProps } from "@graphter/core";
import { useNodeData, useNodeValidation } from "@graphter/renderer-react";
import { setupNodeRenderer } from "@graphter/renderer-react";
import InlineValidation from "../../inline-validation";

const StringNodeRenderer: ComponentType<NodeRendererProps> = setupNodeRenderer((
  {
    config,
    path
  }: NodeRendererProps
) => {
  const [ touched, setTouched ] = useState(false)
  const [ nodeData, setNodeData ] = useNodeData<string>(path)
  const validationResults = useNodeValidation(config, path)
  return (
    <>
      <input
        type='text'
        value={nodeData}
        data-nodetype='string'
        data-nodepath={path.join('/')}
        className='flex-grow p-3 rounded'
        onChange={(e) => {
          if(!touched) setTouched(true)
          setNodeData && setNodeData(e.currentTarget.value);
        }} />
      <InlineValidation
        touched={touched}
        validationData={validationResults}
        nodeData={nodeData} />
    </>
  )
})

export default StringNodeRenderer