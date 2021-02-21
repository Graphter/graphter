import { PathSegment } from "@graphter/core";
import { useNodeData } from "@graphter/renderer-react";
import React from "react";

export interface DynamicCrumbProps {
  displayPath: Array<PathSegment>
  displayLabel: string
}
const DynamicCrumb = ({ displayPath, displayLabel }: DynamicCrumbProps) => {
  const [ displayValue ] = useNodeData<any>(displayPath)
  if(typeof displayValue === 'string' && !displayValue){
    return <span className='text-gray-400'>Unnamed</span>
  }
  switch(typeof displayValue){
    case 'undefined': return <>Empty</>
    case 'string': return <>{displayValue}</>
    default: return <>{displayLabel}</>
  }
}

export default DynamicCrumb