
import React  from "react";
import { NodeValidationData } from "@graphter/renderer-react";
import cs from "classnames";

interface InlineValidationProps {
  touched: boolean
  validationData: NodeValidationData,
  nodeData: any
}

const InlineValidation = ({ touched, validationData, nodeData }: InlineValidationProps) => {
  const showErrors = touched &&
    validationData
  const invalidResults = validationData.results
    .filter(result => !result.valid)
  if(!showErrors || invalidResults.length === 0) return null
  return (
    <ul className={cs(invalidResults.length === 1 ? 'list-none' : 'list-disc', 'list-inside', 'text-red-700', 'text-sm')} >
      {invalidResults.map((invalidResult, i) => (
        <li className='' key={i} data-testid='validation-error'>
          {invalidResult.errorMessage}
        </li>
      ))}
    </ul>
  )
}

export default InlineValidation