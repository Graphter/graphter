import React  from 'react';
import { NodeConfig, PathSegment } from "@graphter/core";
import { useAggregateNodeValidation } from "../providers/node-validation";
import { useTreePaths } from "../providers/state";

export interface ValidationSummaryProps {
  config: NodeConfig,
  path: Array<PathSegment>
}

export default function ValidationSummary({ config, path }: ValidationSummaryProps){
  const descendentPaths = useTreePaths(config, path)
  const aggregatedValidationData = useAggregateNodeValidation(descendentPaths)
  const someErrors = aggregatedValidationData
    .some(validationData => validationData.results
      .some(validationResult => !validationResult.valid))
  if(!someErrors) return null

  return (
    <div className='mb-10'>
      {aggregatedValidationData.map((validationData, i) => {
        return (
          <div key={i}>
            {validationData.results.map((result, i) => {
              if(result.valid) return null
              return (
                <div key={i}>{validationData.path.join('/')}: {result.errorMessage}</div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}