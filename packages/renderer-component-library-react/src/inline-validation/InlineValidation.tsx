
import React  from "react";

interface InlineValidationProps {
  touched: boolean
  nodeData: any
}

const InlineValidation = ({ touched, nodeData }: InlineValidationProps) => {
  // TODO: Redo
  return <div>Inline validation</div>
  // const showErrors = touched &&
  //   validationData
  // const invalidResults = validationData.results
  //   .filter(result => !result.valid)
  // if(!showErrors || invalidResults.length === 0) return null
  // return (
  //   <ul className={cs(invalidResults.length === 1 ? 'list-none' : 'list-disc', 'list-inside', 'text-red-700', 'text-sm')} >
  //     {invalidResults.map((invalidResult, i) => (
  //       <li className='' key={i} data-testid='validation-error'>
  //         {invalidResult.errorMessage}
  //       </li>
  //     ))}
  //   </ul>
  // )
}

export default InlineValidation