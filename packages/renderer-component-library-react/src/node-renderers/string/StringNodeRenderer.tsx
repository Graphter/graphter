import React, { ComponentType, useState } from "react";
import { NodeRendererProps } from "@graphter/core";
import { useNodeData } from "@graphter/renderer-react";
import { setupNodeRenderer } from "@graphter/renderer-react";
import InlineValidation from "../../inline-validation";

const StringNodeRenderer: ComponentType<NodeRendererProps> = setupNodeRenderer((
  {
    config,
    path,
    originalTreeData
  }: NodeRendererProps
) => {
  const [ touched, setTouched ] = useState(false)
  const [ nodeData, setNodeData ] = useNodeData<string>(path, config, originalTreeData)
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
        nodeData={nodeData} />
    </>
  )
})

export default StringNodeRenderer